import wrapAsync from '@/libs/wrapAsync'
import Question, { QuestionType } from '../model'
import ExamResult, { ExamResultStatus } from '@/modules/examResult/model'
import { v4 as uuidv4 } from 'uuid'
import { Knex } from 'knex'
import { transaction, Transaction } from 'objection'
import QuestionBank, { ExamStatus } from '@/modules/bankSoal/model'
import ActivityLog, { ActivityType } from '@/modules/activityLog/model'

export const indexId = wrapAsync(async (req: any) => {
  const id = req.params.id
  const qb = Question.query().where('questionBankId', '=', id).withGraphFetched('answers')

  // qb.where('kodeGuru', '=', req.user.kode)

  const result = await qb
  return result
})

export const getExamQuestions = wrapAsync(async (req: any, res: any) => {
  const { id } = req.params

  const questionBank = await QuestionBank.query().withGraphFetched('questions.answers').findById(id)

  if (!questionBank) {
    throw new Error('Exam not found')
  }

  if (questionBank.status !== ExamStatus.ACTIVE) {
    throw new Error('Exam is not active')
  }

  let questions = questionBank.questions || []

  if (questionBank.randomizeQuestions) {
    questions = questions.sort(() => Math.random() - 0.5)
  }

  if (questionBank.randomizeAnswers) {
    questions = questions.map((question: any) => ({
      ...question,
      answers: question.answers?.sort(() => Math.random() - 0.5),
    }))
  }

  return {
    examData: {
      id: questionBank.id,
      title: questionBank.title,
      duration: questionBank.duration,
      instructions: questionBank.instructions,
      requireAllAnswers: questionBank.requireAllAnswers,
      randomizeQuestions: questionBank.randomizeQuestions,
      randomizeAnswers: questionBank.randomizeAnswers,
    },
    questions,
  }
})

// The function to calculate the score and store it in the `exam_results` table
const calculateScore = async (examId: string, studentId: string, studentAnswers: object, knex: Knex) => {
  try {
    const questions = await Question.query(knex).where('questionBankId', examId).withGraphFetched('answers')

    let correctAnswersCount = 0

    questions.forEach((question) => {
      const studentAnswer = studentAnswers[question.id] // Get student's answer (true/false from frontend)

      // Convert boolean to number: true = 1 (correct), false = 0 (incorrect)
      const studentAnswerValue = studentAnswer

      if (studentAnswerValue === 1) {
        correctAnswersCount++
      }
    })

    const totalQuestions = questions.length
    const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0

    return parseFloat(score.toFixed(2)) // Ensure score is a valid number
  } catch (error) {
    console.error('Error calculating score:', error)
    throw new Error('Error calculating score')
  }
}

// POST service for submitting the exam results
export const postExamResult = wrapAsync(async (req: any, res: Response) => {
  const { examId, studentId, answers } = req.body

  if (!examId || !studentId || !answers) {
    throw new Error('Each question must have a correct answer')
  }

  try {
    // Calculate the score based on the answers
    const score = await calculateScore(examId, studentId, answers, req.knex)

    const questionId = uuidv4()
    // Insert the exam result into the database (without 'id' field)
    const res = await ExamResult.query(req.knex).insert({
      id: questionId,
      studentId: studentId,
      questionBankId: examId,
      score: score, // Ensure this is a number
      createdBy: 'system', // Or use the actual user if applicable
      modifiedBy: 'system', // Or use the actual user if applicable
    })
    console.log(res)
    // Send a response back to the client
    return { message: 'Exam result submitted successfully.' }
  } catch (error) {
    console.error('Error occurred:', error)
    throw new Error('An error occurred while submitting the exam result.')
  }
})

export const submitExam = wrapAsync(async (req: any, res: any) => {
  const trx: Transaction = await transaction.start(ExamResult.knex())

  try {
    const { questionBankId, answers, isAutoSubmit = false, duration } = req.body
    const studentId = req.user.nis

    // Get question bank with questions and their answers
    const questionBank = await QuestionBank.query(trx).withGraphFetched('questions.answers').findById(questionBankId)

    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    let score = 0
    let totalPoints = 0
    const questionScores: Record<string, number> = {}

    for (const question of questionBank.questions) {
      totalPoints += question.points

      const studentAnswer = answers[question.id]
      if (!studentAnswer) continue

      let earnedPoints = 0

      switch (question.type) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.TRUE_FALSE:
          // Compare student answer content with correct answer content
          const isCorrect = studentAnswer === question.correctAnswer
          earnedPoints = isCorrect ? question.points : 0
          break

        case QuestionType.COMPLEX_MULTIPLE_CHOICE:
          // For multiple correct answers, compare content arrays
          const correctAnswers = question.correctAnswers ? JSON.parse(question.correctAnswers) : []
          const studentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]

          // Sort both arrays and compare content
          const sortedCorrect = [...correctAnswers].sort()
          const sortedStudent = [...studentAnswers].sort()

          const isComplexCorrect =
            sortedCorrect.length === sortedStudent.length && sortedCorrect.every((ans: string, index: number) => ans === sortedStudent[index])

          earnedPoints = isComplexCorrect ? question.points : 0
          break

        case QuestionType.ESSAY:
          const keywords = question.keywords ? JSON.parse(question.keywords) : []
          const answerText = studentAnswer.toLowerCase()
          const matchedKeywords = keywords.filter((keyword: string) => answerText.includes(keyword.toLowerCase()))
          const matchPercentage = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0

          if (matchPercentage >= 0.8) {
            earnedPoints = question.points
          } else if (matchPercentage >= 0.6) {
            earnedPoints = Math.ceil(question.points * 0.7)
          } else if (matchPercentage >= 0.4) {
            earnedPoints = Math.ceil(question.points * 0.5)
          } else {
            earnedPoints = 0
          }
          break
      }

      score += earnedPoints
      questionScores[question.id] = earnedPoints
    }

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0

    const existingResult = await ExamResult.query(trx).findOne({ questionBankId, studentId })

    const resultData = {
      score,
      totalPoints,
      percentage,
      status: isAutoSubmit ? ExamResultStatus.AUTO_SUBMITTED : ExamResultStatus.SUBMITTED,
      answers,
      submittedAt: new Date(),
      duration,
      // violations,
      modifiedAt: new Date(),
      modifiedBy: req.user.nis,
    }

    if (existingResult) {
      await ExamResult.query(trx).findById(existingResult.id).patch(resultData)
    } else {
      await ExamResult.query(trx).insert({
        id: uuidv4(),
        studentId,
        questionBankId,
        createdAt: new Date(),
        createdBy: req.user.id,
        ...resultData,
      })
    }

    await ActivityLog.query(trx).insert({
      id: uuidv4(),
      userId: req.user.nis,
      userType: 'student',
      activity: isAutoSubmit ? ActivityType.EXAM_AUTO_SUBMIT : ActivityType.EXAM_SUBMIT,
      description: `${isAutoSubmit ? 'Auto-submitted' : 'Submitted'} exam: ${questionBank.title}`,
      metadata: JSON.stringify({ questionBankId, score, percentage, duration }),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    })

    await trx.commit()

    return {
      message: isAutoSubmit ? 'Ujian otomatis tersubmit' : 'Ujian berhasil disubmit',
      data: {
        score,
        totalPoints,
        percentage,
        status: resultData.status,
        questionScores,
      },
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

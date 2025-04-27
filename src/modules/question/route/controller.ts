import wrapAsync from '@/libs/wrapAsync'
import Question from '../model'
import ExamResult from '@/modules/examResult/model'
import { v4 as uuidv4 } from 'uuid'
import { Knex } from 'knex'

export const indexId = wrapAsync(async (req: any) => {
  const id = req.params.id
  const qb = Question.query().where('questionBankId', '=', id).withGraphFetched('answers')

  // qb.where('kodeGuru', '=', req.user.kode)

  const result = await qb
  return result
})

// The function to calculate the score and store it in the `exam_results` table
const calculateScore = async (examId: string, studentId: string, studentAnswers: object, knex: Knex) => {
  try {
    const questions = await Question.query(knex).where('questionBankId', examId).withGraphFetched('answers')

    let correctAnswersCount = 0

    questions.forEach((question) => {
      const correctAnswer = question.correctAnswer
      const studentAnswer = studentAnswers[question.id] // Get student's answer

      if (studentAnswer === correctAnswer) {
        correctAnswersCount++
      }
    })

    const totalQuestions = questions.length
    const score = (correctAnswersCount / totalQuestions) * 100

    return parseFloat(score.toFixed(2)) // Ensure score is a valid number
  } catch (error) {
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
    await ExamResult.query(req.knex).insert({
      id: questionId,
      studentId: studentId,
      questionBankId: examId,
      score: score, // Ensure this is a number
      createdBy: 'system', // Or use the actual user if applicable
      modifiedBy: 'system', // Or use the actual user if applicable
    })

    // Send a response back to the client
    return { message: 'Exam result submitted successfully.' }
  } catch (error) {
    console.error('Error occurred:', error)
    throw new Error('An error occurred while submitting the exam result.')
  }
})

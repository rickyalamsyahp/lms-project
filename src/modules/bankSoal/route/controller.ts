// Fixed Question Bank Service for MariaDB
import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import { transaction, Transaction } from 'objection'
import { v4 as uuidv4 } from 'uuid'
import QuestionBank, { ExamStatus } from '../model'
import Question, { QuestionType } from '../../question/model'
import Answer from '../../answer/model'
import ExamResult, { ExamResultStatus } from '../../examResult/model'
import ActivityLog, { ActivityType } from '../../activityLog/model'

// Type definitions for better type safety
interface PaginationParams {
  page?: string | number
  size?: string | number
  search?: string
  teacherId?: string
  kodeKelas?: string
  studentId?: string
  status?: string
}

interface QuestionData {
  pertanyaan: string
  type: QuestionType
  points?: number
  jawaban?: Array<{
    text: string
    isCorrect: boolean
    imageUrl?: string
    audioUrl?: string
  }>
  keywords?: string[]
  imageUrl?: string
  audioUrl?: string
  equation?: string
  explanation?: string
}

interface CreateQuestionBankData {
  mataPelajaranId: string
  classroomIds?: number[]
  kelasId?: number
  semester: string
  tanggalUjian: string
  durasiUjian: number
  soal?: QuestionData[]
  guruId: number
  coTeacherIds?: number[]
  jamUjian: string
  title: string
  description?: string
  randomizeQuestions?: boolean
  randomizeAnswers?: boolean
  requireAllAnswers?: boolean
  showResults?: boolean
  allowReview?: boolean
  instructions?: string
  passingScore?: number
  status?: ExamStatus
}

export const index = wrapAsync(async (req: EGRequest, res: any) => {
  const { page = 1, size = 10, search = '', teacherId, kodeKelas, studentId, status }: PaginationParams = req.query

  let query = QuestionBank.query()
    .withGraphFetched('teacher')
    .withGraphFetched('subject')
    .withGraphFetched('results')
    .orderBy('question_banks.createdAt', 'desc')

  if (search) {
    query = query.where('title', 'ilike', `%${search}%`)
  }

  if (teacherId) {
    query = query.where('teacherId', parseInt(teacherId as string))
  }

  if (status) {
    query = query.where('status', status as ExamStatus)
  }

  // Fixed: Use existing classroomId column instead of JSON
  if (kodeKelas) {
    query = query.where('classroomId', parseInt(kodeKelas as string))
  }

  // Add classroom data
  query = query.withGraphFetched('classroom.jurusans')

  if (studentId) {
    query = query.modifyGraph('results', (builder) => {
      builder.where('studentId', studentId as string)
    })
  }

  const result = await query.page(Number(page) - 1, Number(size))

  return {
    results: result.results,
    total: result.total,
    page: Number(page),
    size: Number(size),
    totalPages: Math.ceil(result.total / Number(size)),
  }
})

export const indexByid = wrapAsync(async (req: EGRequest, res: any) => {
  const params = req.params.id

  const query = QuestionBank.query()
    .withGraphFetched('teacher')
    .withGraphFetched('subject')
    .withGraphFetched('classrooms.jurusans')
    .withGraphFetched('questions.answers')
    .orderBy('createdAt', 'desc')
    .findById(params)

  const result = await query

  return result
})

export const store = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(QuestionBank.knex())

  try {
    const data: CreateQuestionBankData = req.body
    const {
      mataPelajaranId,
      classroomIds,
      kelasId,
      semester,
      tanggalUjian,
      durasiUjian,
      soal,
      guruId,
      coTeacherIds,
      jamUjian,
      title,
      description,
      randomizeQuestions = false,
      randomizeAnswers = false,
      requireAllAnswers = true,
      showResults = true,
      allowReview = false,
      instructions,
      passingScore,
      status = ExamStatus.DRAFT,
    } = data

    // Handle backward compatibility
    const finalClassroomIds = classroomIds || (kelasId ? [kelasId] : [])

    if (!mataPelajaranId || !finalClassroomIds.length || !semester || !tanggalUjian || !guruId || !title) {
      throw new Error('Missing required fields')
    }

    const questionBankId = uuidv4()

    // Calculate total questions and points
    let totalQuestions = 0
    let totalPoints = 0

    if (soal?.length) {
      totalQuestions = soal.length
      totalPoints = soal.reduce((sum: number, q: QuestionData) => sum + (q.points || 1), 0)
    }

    // Create question bank
    await QuestionBank.query(trx).insert({
      id: questionBankId,
      teacherId: guruId,
      mataPelajaranId,
      classroomId: finalClassroomIds[0], // Keep first classroom for backward compatibility
      title,
      description,
      duration: durasiUjian,
      semester,
      scheduledAt: tanggalUjian,
      jamUjian,
      status,
      randomizeQuestions,
      randomizeAnswers,
      requireAllAnswers,
      showResults,
      allowReview,
      instructions,
      passingScore,
      totalQuestions,
      totalPoints,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    // Insert classroom relationships in junction table
    for (const classroomId of finalClassroomIds) {
      await trx('question_bank_classrooms').insert({
        questionBankId,
        classroomId: parseInt(classroomId.toString()),
      })
    }

    // Insert co-teacher relationships (if you have this table)
    if (coTeacherIds?.length) {
      for (const coTeacherId of coTeacherIds) {
        await trx('question_bank_teachers').insert({
          questionBankId,
          teacherId: coTeacherId,
        })
      }
    }

    // Create questions with enhanced features
    if (soal?.length) {
      for (let i = 0; i < soal.length; i++) {
        const questionData = soal[i]
        const questionId = uuidv4()

        // Handle different question types
        let correctAnswer: string | null = null
        let correctAnswers: string[] | null = null
        let keywords: string[] | null = null

        switch (questionData.type) {
          case QuestionType.MULTIPLE_CHOICE:
          case QuestionType.TRUE_FALSE:
            const correctAnswerObj = questionData.jawaban?.find((answer) => answer.isCorrect)
            if (correctAnswerObj) {
              correctAnswer = correctAnswerObj.text // Store actual answer text
            }
            break

          case QuestionType.COMPLEX_MULTIPLE_CHOICE:
            correctAnswers = []
            questionData.jawaban?.forEach((answer, index) => {
              if (answer.isCorrect) {
                correctAnswers!.push(answer.text) // Store actual answer texts
              }
            })
            break

          case QuestionType.ESSAY:
            keywords = questionData.keywords || []
            break
        }

        // Create question
        await Question.query(trx).insert({
          id: questionId,
          questionBankId,
          content: questionData.pertanyaan,
          type: (questionData.type || QuestionType.MULTIPLE_CHOICE) as QuestionType,
          correctAnswer,
          correctAnswers: correctAnswers ? JSON.stringify(correctAnswers) : null,
          keywords: keywords ? JSON.stringify(keywords) : null,
          imageUrl: questionData.imageUrl,
          audioUrl: questionData.audioUrl,
          equation: questionData.equation,
          points: questionData.points || 1,
          explanation: questionData.explanation,
          order: i + 1,
        })

        // Create answers for non-essay questions
        if (questionData.type !== QuestionType.ESSAY && questionData.jawaban?.length) {
          for (let j = 0; j < questionData.jawaban.length; j++) {
            const answer = questionData.jawaban[j]
            await Answer.query(trx).insert({
              id: uuidv4(),
              questionId,
              content: answer.text,
              imageUrl: answer.imageUrl,
              audioUrl: answer.audioUrl,
              isCorrect: answer.isCorrect || false,
            })
          }
        }
      }
    }

    // Log activity if ActivityLog table exists
    try {
      await ActivityLog.query(trx).insert({
        id: uuidv4(),
        userId: req.user.id,
        userType: 'teacher',
        activity: ActivityType.QUESTION_CREATE,
        description: `Created exam: ${title}`,
        metadata: JSON.stringify({ questionBankId, totalQuestions, totalPoints }),
        ipAddress: req.ip,
        userAgent: 'teacher',
      })
    } catch (logError: any) {
      // Ignore if ActivityLog table doesn't exist yet
      console.log('Activity log not available:', logError.message)
    }

    await trx.commit()

    return {
      message: 'Soal ujian berhasil disimpan',
      data: {
        id: questionBankId,
        title,
        status,
        totalQuestions,
        totalPoints,
        classrooms: finalClassroomIds.length,
      },
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

export const update = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(QuestionBank.knex())

  try {
    const { id } = req.params
    const {
      mataPelajaranId,
      classroomIds,
      semester,
      tanggalUjian,
      durasiUjian,
      soal,
      title,
      description,
      randomizeQuestions,
      randomizeAnswers,
      requireAllAnswers,
      instructions,
      status,
    } = req.body

    // Check if question bank exists
    const questionBank = await QuestionBank.query(trx).findById(id)
    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    // Check if exam can be edited (only if not started yet)
    const now = new Date()
    const examDate = new Date(questionBank.scheduledAt)
    if (examDate <= now && questionBank.status === ExamStatus.ACTIVE) {
      throw new Error('Cannot edit exam that has already started')
    }

    // Update question bank
    const updateData: Partial<QuestionBank> = {
      modifiedBy: req.user.id,
      modifiedAt: new Date(),
    }

    if (mataPelajaranId) updateData.mataPelajaranId = mataPelajaranId
    if (tanggalUjian) updateData.scheduledAt = tanggalUjian
    if (durasiUjian) updateData.duration = durasiUjian
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (randomizeQuestions !== undefined) updateData.randomizeQuestions = randomizeQuestions
    if (randomizeAnswers !== undefined) updateData.randomizeAnswers = randomizeAnswers
    if (requireAllAnswers !== undefined) updateData.requireAllAnswers = requireAllAnswers
    if (instructions !== undefined) updateData.instructions = instructions
    if (status) updateData.status = status

    await QuestionBank.query(trx).findById(id).patch(updateData)

    // Update classroom relationships if changed
    if (classroomIds) {
      // Delete existing relationships
      await trx('question_bank_classrooms').where('questionBankId', id).del()

      // Insert new relationships
      const classroomArray = Array.isArray(classroomIds) ? classroomIds : [classroomIds]
      for (const classroomId of classroomArray) {
        await trx('question_bank_classrooms').insert({
          questionBankId: id,
          classroomId: parseInt(classroomId.toString()),
        })
      }
    }

    // If questions are being updated
    if (soal && soal.length) {
      // Delete existing questions and answers
      const existingQuestions = await Question.query(trx).where('questionBankId', id)
      for (const question of existingQuestions) {
        await Answer.query(trx).where('questionId', question.id).delete()
      }
      await Question.query(trx).where('questionBankId', id).delete()

      // Create new questions and answers
      for (let i = 0; i < soal.length; i++) {
        const questionData: QuestionData = soal[i]
        const questionId = uuidv4()

        // Determine correct answer(s) based on question type
        let correctAnswer: string | null = null
        let correctAnswers: string[] | null = null

        if (questionData.type === QuestionType.MULTIPLE_CHOICE || questionData.type === QuestionType.TRUE_FALSE) {
          const correctIndex = questionData.jawaban?.findIndex((answer) => answer.isCorrect)
          if (correctIndex !== undefined && correctIndex !== -1) {
            correctAnswer = String.fromCharCode(97 + correctIndex)
          }
        } else if (questionData.type === QuestionType.COMPLEX_MULTIPLE_CHOICE) {
          correctAnswers = []
          questionData.jawaban?.forEach((answer, index) => {
            if (answer.isCorrect) {
              correctAnswers!.push(String.fromCharCode(97 + index))
            }
          })
        }

        // Create question
        await Question.query(trx).insert({
          id: questionId,
          questionBankId: id,
          content: questionData.pertanyaan,
          type: questionData.type || QuestionType.MULTIPLE_CHOICE,
          correctAnswer,
          correctAnswers: correctAnswers ? JSON.stringify(correctAnswers) : null,
          keywords: questionData.keywords ? JSON.stringify(questionData.keywords) : null,
          imageUrl: questionData.imageUrl,
          audioUrl: questionData.audioUrl,
          equation: questionData.equation,
          points: questionData.points || 1,
          explanation: questionData.explanation,
          order: i + 1,
        })

        // Create answers for non-essay questions
        if (questionData.type !== QuestionType.ESSAY && questionData.jawaban?.length) {
          for (let j = 0; j < questionData.jawaban.length; j++) {
            const answer = questionData.jawaban[j]
            await Answer.query(trx).insert({
              id: uuidv4(),
              questionId,
              content: answer.text,
              imageUrl: answer.imageUrl,
              audioUrl: answer.audioUrl,
              isCorrect: answer.isCorrect || false,
            })
          }
        }
      }

      // Update total questions and points
      const totalQuestions = soal.length
      const totalPoints = soal.reduce((sum: number, q: QuestionData) => sum + (q.points || 1), 0)

      await QuestionBank.query(trx).findById(id).patch({
        totalQuestions,
        totalPoints,
      })
    }

    await trx.commit()

    return {
      message: 'Soal ujian berhasil diperbarui',
      data: { id },
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

// Rest of the methods remain the same but with improved typing...
export const reopenExam = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(QuestionBank.knex())

  try {
    const { id } = req.params
    const { studentIds }: { studentIds?: string[] } = req.body

    const questionBank = await QuestionBank.query(trx).findById(id)
    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    let whereClause = trx('exam_results').where('questionBankId', id)

    if (studentIds?.length) {
      whereClause = whereClause.whereIn('studentId', studentIds)
    }

    await whereClause.whereIn('status', [ExamResultStatus.SUBMITTED, ExamResultStatus.AUTO_SUBMITTED]).update({
      status: ExamResultStatus.REOPENED,
      reopenedBy: req.user.id,
      reopenedAt: new Date(),
      modifiedBy: req.user.id,
      modifiedAt: new Date(),
    })

    await ActivityLog.query(trx).insert({
      id: uuidv4(),
      userId: req.user.id,
      userType: 'admin',
      activity: ActivityType.EXAM_REOPEN,
      description: `Reopened exam: ${questionBank.title}`,
      metadata: JSON.stringify({ questionBankId: id, studentIds }),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    })

    await trx.commit()

    return {
      message: 'Ujian berhasil dibuka kembali',
      data: { id, reopenedFor: studentIds?.length || 'all students' },
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

export const autoSave = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(ExamResult.knex())

  try {
    const { questionBankId, answers } = req.body
    const studentId = req.user.id

    const existingResult = await ExamResult.query(trx).findOne({ questionBankId, studentId })

    if (existingResult) {
      await ExamResult.query(trx).findById(existingResult.id).patch({
        autoSaveData: answers,
        modifiedAt: new Date(),
        modifiedBy: req.user.id,
      })
    } else {
      await ExamResult.query(trx).insert({
        id: uuidv4(),
        studentId,
        questionBankId,
        status: ExamResultStatus.IN_PROGRESS,
        autoSaveData: answers,
        createdAt: new Date(),
        createdBy: req.user.id,
      })
    }

    await trx.commit()

    return { message: 'Auto-save successful', timestamp: new Date() }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

export const destroy = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(QuestionBank.knex())

  try {
    const { id } = req.params

    const questionBank = await QuestionBank.query(trx).findById(id)
    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    if (questionBank.status !== ExamStatus.DRAFT) {
      throw new Error('Only draft exams can be deleted')
    }

    const questions = await Question.query(trx).where('questionBankId', id)

    for (const question of questions) {
      await Answer.query(trx).where('questionId', question.id).delete()
    }

    await Question.query(trx).where('questionBankId', id).delete()
    await trx('question_bank_classrooms').where('questionBankId', id).del()
    await QuestionBank.query(trx).deleteById(id)

    await trx.commit()

    return {
      message: 'Soal ujian berhasil dihapus',
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

export const getExamQuestions = wrapAsync(async (req: EGRequest, res: any) => {
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

export const submitExam = wrapAsync(async (req: EGRequest, res: any) => {
  const trx: Transaction = await transaction.start(ExamResult.knex())

  try {
    const { questionBankId, answers, isAutoSubmit = false, duration, violations = 0 } = req.body
    const studentId = req.user.id

    const questionBank = await QuestionBank.query(trx).withGraphFetched('questions').findById(questionBankId)

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
          const isCorrect = studentAnswer === question.correctAnswer
          earnedPoints = isCorrect ? question.points : 0
          break

        case QuestionType.COMPLEX_MULTIPLE_CHOICE:
          const correctAnswers = question.correctAnswers ? JSON.parse(question.correctAnswers) : []
          const studentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer]
          const isComplexCorrect = correctAnswers.length === studentAnswers.length && correctAnswers.every((ans: string) => studentAnswers.includes(ans))
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
      violations,
      modifiedAt: new Date(),
      modifiedBy: req.user.id,
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
      userId: req.user.id,
      userType: 'student',
      activity: isAutoSubmit ? ActivityType.EXAM_AUTO_SUBMIT : ActivityType.EXAM_SUBMIT,
      description: `${isAutoSubmit ? 'Auto-submitted' : 'Submitted'} exam: ${questionBank.title}`,
      metadata: JSON.stringify({ questionBankId, score, percentage, duration, violations }),
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

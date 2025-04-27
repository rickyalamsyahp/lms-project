import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import { transaction } from 'objection'
import { v4 as uuidv4 } from 'uuid'
import QuestionBank from '../model'
import Question from '../../question/model'
import Answer from '../../answer/model'
import Classroom from '@/modules/classroom/model'
import Matapelajaran from '@/modules/matapelajaran/model'

export const index = wrapAsync(async (req: EGRequest, res: any) => {
  const { page = 1, size = 10, search = '', teacherId, kodeKelas, studentId } = req.query

  // Build query with filters
  let query = QuestionBank.query()
    .withGraphFetched('teacher')
    .withGraphFetched('subject')
    .withGraphFetched('classroom.jurusans')
    .withGraphFetched('result')
    .orderBy('createdAt', 'desc')

  // Apply search
  if (search) {
    query = query.where('title', 'ilike', `%${search}%`)
  }

  // Apply filters
  if (teacherId) {
    query = query.where('teacherId', teacherId as string)
  }

  if (kodeKelas) {
    query = query.where('classroomId', kodeKelas as string)
  }
  if (studentId) {
    query = query.modifyGraph('result', (builder) => {
      builder.where('studentId', studentId as string)
    })
  }
  // Execute with pagination
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

  // Build query with filters
  const query = QuestionBank.query()
    .withGraphFetched('teacher')
    .withGraphFetched('subject')
    .withGraphFetched('classroom.jurusans')
    .orderBy('createdAt', 'desc')
    .findById(params)

  // Execute with pagination
  const result = await query

  return result
})

export const store = wrapAsync(async (req: EGRequest, res: any) => {
  // Use a more specific type or any to break the deep instantiation
  const trx = await transaction.start(QuestionBank.knex())

  try {
    // Validate request
    const { mataPelajaranId, kelasId, jurusanId, semester, tanggalUjian, durasiUjian, soal, guruId, jamUjian } = req.body

    if (!mataPelajaranId || !kelasId || !jurusanId || !semester || !tanggalUjian || !soal || !guruId || !soal.length) {
      throw new Error('Missing required fields')
    }

    // Create the bank
    const questionBankId = uuidv4()

    // Find classroom ID based on kelas, jurusan, semester
    const classroom = await Classroom.query(trx)
      .where({
        kode: kelasId,
      })
      .first()

    if (!classroom) {
      throw new Error('Classroom not found')
    }

    // Get mata pelajaran for title
    const mataPelajaran = await Matapelajaran.query(trx).where('kode', mataPelajaranId).first()

    const title = `${mataPelajaran.nama || 'Soal'} - Kelas ${classroom.nama} - Semester ${semester}`

    // Create question bank
    const res = await QuestionBank.query(trx).insert({
      id: questionBankId,
      teacherId: guruId,
      mataPelajaranId,
      classroomId: classroom.kode,
      title,
      duration: durasiUjian,
      semester: semester,
      scheduledAt: tanggalUjian,
      jamUjian,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    // Create questions and answers
    for (const questionData of soal) {
      const questionId = uuidv4()

      // Find the correct answer
      const correctAnswerIndex = questionData.jawaban.findIndex((answer) => answer.isCorrect)
      if (correctAnswerIndex === -1) {
        throw new Error('Each question must have a correct answer')
      }

      // Map correct answer to a, b, c, d
      const correctAnswer = String.fromCharCode(97 + correctAnswerIndex) // 97 is ASCII for 'a'

      // Create question
      await Question.query(trx).insert({
        id: questionId,
        questionBankId,
        content: questionData.pertanyaan,
        correctAnswer,
      })

      // Create answers
      for (let i = 0; i < questionData.jawaban.length; i++) {
        const answer = questionData.jawaban[i]
        await Answer.query(trx).insert({
          id: uuidv4(),
          questionId,
          content: answer.text,
          option: String.fromCharCode(97 + i), // a, b, c, d
        })
      }
    }

    await trx.commit()

    return {
      message: 'Soal ujian berhasil disimpan',
      data: {
        id: questionBankId,
        title,
      },
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
})

export const update = wrapAsync(async (req: EGRequest, res: any) => {
  const trx = await transaction.start(QuestionBank.knex())

  try {
    const { id } = req.params
    const { mataPelajaranId, kelasId, jurusanId, semester, tanggalUjian, durasiUjian, soal } = req.body

    // Check if question bank exists
    const questionBank = await QuestionBank.query(trx).findById(id)
    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    // Find classroom ID if classroom details are being updated
    let classroomId = questionBank.classroomId
    if (kelasId && jurusanId && semester) {
      const classroom = await trx('classrooms')
        .where({
          kelas: kelasId,
          jurusanId,
          semester,
        })
        .first()

      if (!classroom) {
        throw new Error('Classroom not found')
      }

      classroomId = classroom.id
    }

    // Update question bank
    const updateData: any = {
      modifiedBy: req.user.id,
      modifiedAt: new Date(),
    }

    if (mataPelajaranId) updateData.mataPelajaranId = mataPelajaranId
    if (classroomId !== questionBank.classroomId) updateData.classroomId = classroomId
    if (tanggalUjian) updateData.scheduledAt = new Date(tanggalUjian)

    await QuestionBank.query(trx).findById(id).patch(updateData)

    // If questions are being updated
    if (soal && soal.length) {
      // Delete existing questions and answers
      const existingQuestions = await Question.query(trx).where('questionBankId', id)
      for (const question of existingQuestions) {
        await Answer.query(trx).where('questionId', question.id).delete()
      }
      await Question.query(trx).where('questionBankId', id).delete()

      // Create new questions and answers
      for (const questionData of soal) {
        const questionId = uuidv4()

        // Find the correct answer
        const correctAnswerIndex = questionData.jawaban.findIndex((answer) => answer.isCorrect)
        if (correctAnswerIndex === -1) {
          throw new Error('Each question must have a correct answer')
        }

        // Map correct answer to a, b, c, d
        const correctAnswer = String.fromCharCode(97 + correctAnswerIndex)

        // Create question
        await Question.query(trx).insert({
          id: questionId,
          questionBankId: id,
          content: questionData.pertanyaan,
          correctAnswer,
        })

        // Create answers
        for (let i = 0; i < questionData.jawaban.length; i++) {
          const answer = questionData.jawaban[i]
          await Answer.query(trx).insert({
            id: uuidv4(),
            questionId,
            content: answer.text,
            option: String.fromCharCode(97 + i),
          })
        }
      }
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

export const destroy = wrapAsync(async (req: EGRequest, res: any) => {
  const trx = await transaction.start(QuestionBank.knex())

  try {
    const { id } = req.params

    // Check if question bank exists
    const questionBank = await QuestionBank.query(trx).findById(id)
    if (!questionBank) {
      throw new Error('Question bank not found')
    }

    // Get all questions
    const questions = await Question.query(trx).where('questionBankId', id)

    // Delete answers for each question
    for (const question of questions) {
      await Answer.query(trx).where('questionId', question.id).delete()
    }

    // Delete questions
    await Question.query(trx).where('questionBankId', id).delete()

    // Delete question bank
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

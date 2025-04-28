import wrapAsync from '@/libs/wrapAsync'
import ExamResult from '../model'

export const index = wrapAsync(async (req: any, res: any) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query
    const pageNumber = Number(page) || 1
    const pageSize = Number(size) || 10

    // Build query with filters
    let query = ExamResult.query()
      .withGraphFetched('student')
      .withGraphFetched('questionBank')
      .withGraphFetched('questionBank.teacher')
      .withGraphFetched('questionBank.subject')
      .withGraphFetched('questionBank.classroom.jurusans')
    // Apply search
    if (search) {
      query = query.whereExists(ExamResult.relatedQuery('questionBank').where('question_banks.title', 'ilike', `%${search}%`))
    }

    if (req.user.role === 'siswa') {
      query = query.where('studentId', '=', `${req.user.nis}`)
    }

    // Execute with pagination
    const result = await query.page(pageNumber - 1, pageSize)

    // Make sure result exists before accessing properties
    if (!result) {
      throw new Error('No results returned from query')
    }

    // Adjust this based on the actual structure returned by Objection
    return {
      results: result.results || [],
      total: result.total || 0,
      page: pageNumber,
      size: pageSize,
      totalPages: Math.ceil((result.total || 0) / pageSize),
    }
  } catch (error) {
    console.error('Error in exam results index:', error)
    throw error
  }
})

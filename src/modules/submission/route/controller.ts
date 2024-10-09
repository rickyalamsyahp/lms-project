import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import findQuery from 'objection-find'
import Item, { SubmissionStatus } from '../model'
import { ColumnRef, OrderByDirection } from 'objection'
import { apiError } from '@/libs/apiError'
import User from '@/modules/user/model'
import { ScopeSlug } from '@/modules/scope/model'
import SubmissionExam from '../ref/exam/model'
import SubmissionReport from '../ref/report/model'
import SubmissionLog from '../ref/log/model'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)

  // if (req.isInstructor) itemQuery.where({ createdBy: req.user.id })
  if (req.isTrainee) itemQuery.where({ owner: req.user.id })
  const result = await findQuery(Item).build(query, itemQuery).withGraphJoined('courseExam').withGraphJoined('course').withGraphJoined('trainee')

  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { owner, objectType, setting, ...body } = req.body

  const trainee = await User.query().findById(owner).where({ scope: ScopeSlug.TRAINEE })
  if (!trainee) throw new apiError('Peserta dengan ID yang ditentukan tidak ditemukan', 404)

  if (!setting) throw new apiError(`Setting simulasi wajib disertakan`, 400)

  const item = await Item.transaction(async (trx: any) => {
    await Item.query(trx)
      .patch({
        status: SubmissionStatus.CANCELED,
        canceledAt: new Date(),
      })
      .where({
        owner: trainee.id,
        status: SubmissionStatus.ACTIVE,
        objectType,
      })

    const item = await Item.query(trx).insertGraph({
      ...body,
      owner: trainee.id,
      objectType,
    })

    await SubmissionExam.query(trx).insertGraph({
      submissionId: item.id,
      setting,
    })

    return item
  })

  const submission = await Item.query().findById(item.id)
  return submission
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().findById(id).withGraphJoined('exam').withGraphJoined('course')
  if (!result) throw new apiError('Item dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().deleteById(id).whereIn('status', [SubmissionStatus.CANCELED])
  if (!result) throw new apiError('Item dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})

export const removeAll = wrapAsync(async (req: EGRequest) => {
  const { userId } = req.params
  const submissionList = await Item.query().where({ owner: userId })
  if (submissionList.length === 0) throw new apiError(`Tidak ada submission yang terdaftar`, 404)

  const result = await Item.transaction(async (trx) => {
    const submissionIds = submissionList.map((d) => d.id)
    await SubmissionReport.query(trx).delete().whereIn('submissionId', submissionIds)
    await SubmissionLog.query(trx).delete().whereIn('submissionId', submissionIds)
    await SubmissionExam.query(trx).delete().whereIn('submissionId', submissionIds)
    const result = await Item.query(trx).delete().whereIn('id', submissionIds)
    return result
  })
  return result
})

export const cancel = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const item = await Item.query().findById(id)
  if (item.status === SubmissionStatus.FINISHED) {
    throw new apiError(`Tidak dapat melakukan pembatalan terhadap submission yang sudah berstatus ${SubmissionStatus.FINISHED}`, 400)
  }

  const result = await item.$query().patchAndFetch({
    status: SubmissionStatus.CANCELED,
    canceledAt: new Date(),
  })

  return result
})

export const finish = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const { assessment, score } = req.body

  const item = await Item.query().findById(id)

  const result = await Item.transaction(async (trx) => {
    await SubmissionExam.query(trx).patch({ assessment }).where({ submissionId: id })
    const result = await item.$query(trx).patchAndFetch({
      status: SubmissionStatus.FINISHED,
      finishedAt: new Date(),
      score,
    })

    return result
  })

  return result
})

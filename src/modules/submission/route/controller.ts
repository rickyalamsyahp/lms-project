import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import findQuery from 'objection-find'
import Item, { SubmissionStatus } from '../model'
import { ColumnRef, OrderByDirection } from 'objection'
import { apiError } from '@/libs/apiError'
import User from '@/modules/user/model'
import { ScopeSlug } from '@/modules/scope/model'
import Log from '../ref/log/model'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)

  if (!req.isAdmin) itemQuery.where({ createdBy: req.user.id })
  const result = await findQuery(Item).build(query, itemQuery)

  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { owner, train, ...body } = req.body

  const trainee = await User.query().findById(owner).where({ scope: ScopeSlug.TRAINEE })
  if (!trainee) throw new apiError('Peserta dengan ID yang ditentukan tidak ditemukan', 404)

  const item = await Item.transaction(async (trx: any) => {
    await Item.query(trx)
      .patch({
        status: SubmissionStatus.CANCELED,
        canceledAt: new Date(),
      })
      .where({
        owner: trainee.id,
        status: SubmissionStatus.ACTIVE,
        train,
      })
    const item = await Item.query(trx).insertGraph({
      ...body,
      owner: trainee.id,
      train,
    })

    return item
  })

  const submission = await Item.query().findById(item.id)
  return submission
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().findById(id).withGraphJoined('log').withGraphJoined('report')
  if (!result) throw new apiError('Item dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().deleteById(id).whereIn('status', [SubmissionStatus.CANCELED])
  if (!result) throw new apiError('Item dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})

export const cancel = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const item = await Item.query().findById(id)
  if (item.status === SubmissionStatus.FINISHED) {
    const log = await Log.query().count().where({ submissionId: id })
    console.log(log)
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
  const item = await Item.query().findById(id)
  const result = await item.$query().patchAndFetch({
    status: SubmissionStatus.FINISHED,
    finishedAt: new Date(),
  })

  return result
})

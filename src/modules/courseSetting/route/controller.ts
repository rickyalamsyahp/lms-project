import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import findQuery from 'objection-find'
import Item from '../model'
import { ColumnRef, OrderByDirection } from 'objection'
import { apiError } from '@/libs/apiError'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)

  const result = await findQuery(Item).build(query, itemQuery)
  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const result = await Item.query().insertGraphAndFetch({ ...req.body })
  return result
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().findById(id)
  if (!result) throw new apiError('Setting dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const update = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().patchAndFetchById(id, req.body)
  if (!result) throw new apiError(`Setting dengan ID yang ditentukan tidak ditemukan`, 404)
  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().deleteById(id)
  if (!result) throw new apiError('Setting dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})

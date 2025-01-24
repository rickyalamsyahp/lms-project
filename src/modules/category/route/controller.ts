import { EGRequest } from '@/constant/type'
import { apiError } from '@/libs/apiError'
import wrapAsync from '@/libs/wrapAsync'
import { ColumnRef, OrderByDirection } from 'objection'
import findQuery from 'objection-find'
import Item from '../model'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)


  const result = await findQuery(Item).build(query, itemQuery)
  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { name } = req.body
  const result = await Item.transaction(async (trx) => {
console.log(req.body);


    const result = await Item.query(trx).insertGraphAndFetch({
      name: name,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    return result
  })

  return result
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query()
    .findById(id)
  if (!result) throw new apiError('Category dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const update = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const { name } = req.body
  const item = await Item.query().findById(id)
  if (!item) throw new apiError('Category  dengan ID yang ditentukan tidak ditemukan', 404)
  const result = await Item.transaction(async (trx) => {
  

    const result = await Item.query(trx).patchAndFetchById(id, {
      name:name,
      modifiedBy: req.user.id,
      modifiedAt: new Date(),
    })
    return result
  })

  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().deleteById(id)
  if (!result) throw new apiError('Category dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})


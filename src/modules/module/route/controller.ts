import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import findQuery from 'objection-find'
import Item from '../model'
import { ColumnRef, OrderByDirection } from 'objection'
import { apiError } from '@/libs/apiError'
import FileMeta from '@/modules/fileMeta/model'
import { Response } from 'express'
import fs from 'fs'
import path from 'path'

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
  const { title, description } = req.body
  const result = await Item.transaction(async (trx) => {
    if (req.file) {
      const { filename, originalname, encoding, mimetype, size } = req.file
      await FileMeta.query(trx).insertGraph({
        filename,
        originalname,
        encoding,
        mimetype,
        size,
        path: `${process.env.SHARE_STORAGE}/${filename}`,
      })
    }

    const result = await Item.query(trx).insertGraphAndFetch({
      title,
      description,
      filename: req.file?.filename,
      published: false,
      publishedAt: undefined,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    return result
  })

  return result
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().findById(id).withGraphJoined('log').withGraphJoined('report')
  if (!result) throw new apiError('Modul dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const update = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const { title, description } = req.body
  const item = await Item.query().findById(id)
  if (!item) throw new apiError('Modul dengan ID yang ditentukan tidak ditemukan', 404)
  const result = await Item.transaction(async (trx) => {
    if (req.file) {
      const { filename, originalname, encoding, mimetype, size } = req.file
      await FileMeta.query(trx).insertGraph({
        filename,
        originalname,
        encoding,
        mimetype,
        size,
        path: `${process.env.SHARE_STORAGE}/${filename}`,
      })
    }

    const result = await Item.query(trx).patchAndFetchById(id, {
      title,
      description,
      filename: req.file?.filename,
      published: item.published,
      publishedAt: item.publishedAt,
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
  if (!result) throw new apiError('Modul dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})

export const publish = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const item = await Item.query().findById(id)
  if (!item) throw new apiError('Modul dengan ID yang ditentukan tidak ditemukan', 404)
  const result = await item.$query().patchAndFetch({
    published: !item.published,
    publishedAt: new Date(),
    publishedBy: req.user.id,
  })

  return result
})

export const downloadFile = async (req: EGRequest, res: Response) => {
  const id = req.params.id
  const mod = await Item.query().findById(id)
  if (!mod) return res.status(404).send('Fraksi dengan ID yang ditentukan tidak ditemukan')
  if (!mod.filename) return res.status(404).send('Logo untuk fraksi dengan ID yang ditentukan tidak ditemukan')

  const fm = await FileMeta.query().findOne({ filename: mod.filename })
  if (!fm) return res.status(404).send('File tidak ditemukan')
  res.setHeader('content-type', fm.mimetype)
  fs.createReadStream(path.resolve(fm.path)).pipe(res)
}

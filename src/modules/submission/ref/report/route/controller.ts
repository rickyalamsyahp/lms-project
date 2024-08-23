import { EGRequest } from '@/constant/type'
import { apiError } from '@/libs/apiError'
import wrapAsync from '@/libs/wrapAsync'
import FileMeta from '@/modules/fileMeta/model'
import Item from '../model'
import { SubmissionStatus } from '@/modules/submission/model'
import { ColumnRef, OrderByDirection } from 'objection'
import findQuery from 'objection-find'
import path from 'path'
import fs from 'fs'
import { Response } from 'express'
import { SUBMISSION_LOG_STORAGE } from '@/constant/env'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)
    .where({ submissionId: req.params.submissionId })
    .withGraphJoined('fileMeta')

  const result = await findQuery(Item).build(query, itemQuery)

  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { submissionId } = req.params

  if (req.submission.status !== SubmissionStatus.FINISHED)
    throw new apiError(`Submission dengan ID yang ditentukan belum berstatus ${SubmissionStatus.FINISHED}`, 400)

  if (!req.file) throw new apiError('File wajib dilampirkan!', 400)
  const { filename, originalname, encoding, mimetype, size } = req.file

  const result = await Item.transaction(async (trx) => {
    await FileMeta.query(trx).insertGraph({
      filename,
      originalname,
      encoding,
      mimetype,
      size,
      path: `${SUBMISSION_LOG_STORAGE}/${filename}`,
    })

    const item = await Item.query(trx).insertAndFetch({
      ...req.body,
      filename,
      submissionId,
      createdBy: req.user.id,
    })

    return item
  })

  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const item = await Item.query().findById(id)
  if (!item) throw new apiError(`File log dengan ID yang ditentukan tidak ditemukan`, 404)

  const result = await Item.transaction(async (trx) => {
    const result = await Item.query(trx).deleteById(id)
    await FileMeta.query(trx).delete().where({ filename: item.filename })
    return result
  })

  return result
})

export const download = async (req: EGRequest, res: Response) => {
  const { id } = req.params
  const item = await Item.query().findById(id)
  if (!item) return res.status(404).send('File report dengan ID yang ditentukan tidak ditemukan')

  const fm = await FileMeta.query().findOne({ filename: item.filename })
  if (!fm) return res.status(404).send('File tidak ditemukan')
  res.setHeader('content-type', fm.mimetype)
  fs.createReadStream(path.resolve(fm.path)).pipe(res)
}

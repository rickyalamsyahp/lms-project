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
import { REPLAY_BASE_URL_SIMULATION, REPLAY_BASE_URL_VIDEO, SUBMISSION_LOG_STORAGE } from '@/constant/env'

const getReplayPath = (tag: string, filename: string) => {
  return `${tag.toLowerCase() === 'video' ? REPLAY_BASE_URL_VIDEO : tag.toLowerCase() === 'simulation' ? REPLAY_BASE_URL_SIMULATION : ''}/${filename}`
}

export const index = wrapAsync(async (req: EGRequest) => {
  const { submissionId } = req.params
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)
    .where({ submissionId })
    .withGraphJoined('fileMeta')

  // if (!req.isAdmin) itemQuery.andWhere({ createdBy: req.user.id })
  const result = await findQuery(Item).build(query, itemQuery)

  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { submissionId } = req.params

  if (req.submission.status !== SubmissionStatus.FINISHED)
    throw new apiError(`Submission dengan ID yang ditentukan belum berstatus ${SubmissionStatus.FINISHED}`, 400)

  if (!req.file && !req.body.filename) throw new apiError('File wajib dilampirkan!', 400)

  // eslint-disable-next-line prefer-const
  let { filename, originalname, encoding, mimetype, size, ...restBody } = req.file || req.body
  if (!filename) throw new apiError('filename tidak boleh kosong', 400)
  if (!originalname) originalname = filename
  if (!encoding) throw new apiError('encoding tidak boleh ksoong', 400)
  if (!mimetype) throw new apiError('mimetype tidak boleh kosong', 400)
  if (!size) throw new apiError('size tidak boleh kosong', 400)

  const result = await Item.transaction(async (trx) => {
    const isExternalFile = !req.file
    const isExistFile = await FileMeta.query().findOne({ filename })

    if (!isExistFile) {
      await FileMeta.query(trx).insertGraph({
        filename,
        originalname,
        encoding,
        mimetype,
        size,
        path: isExternalFile ? getReplayPath(req.body.tag, filename) : `${SUBMISSION_LOG_STORAGE}/${filename}`,
      })
    }

    const item = await Item.query(trx).insertAndFetch({
      ...(isExternalFile ? restBody : req.body),
      filename,
      submissionId,
      createdBy: req.user.id,
      isExternalFile,
    })

    return item
  })

  return result
})

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id, submissionId } = req.params
  const item = await Item.query().findById(id)
  if (!item) throw new apiError(`File log dengan ID yang ditentukan tidak ditemukan`, 404)

  const result = await Item.transaction(async (trx) => {
    const result = await Item.query(trx).deleteById(id).where({ submissionId })
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
  fs.createReadStream(path.resolve(item.isExternalFile ? getReplayPath(item.tag, item.filename) : fm.path)).pipe(res)
}

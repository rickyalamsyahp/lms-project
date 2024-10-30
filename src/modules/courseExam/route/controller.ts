import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import findQuery from 'objection-find'
import Item from '../model'
import { ColumnRef, OrderByDirection } from 'objection'
import { apiError } from '@/libs/apiError'
import Submission, { SubmissionStatus } from '@/modules/submission/model'
import FileMeta from '@/modules/fileMeta/model'
import { COURSE_STORAGE } from '@/constant/env'
import { Response } from 'express'
import path from 'path'
import fs from 'fs'

export const index = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query

  const itemQuery = Item.query()
    .page(Number(page) - 1, Number(size))
    .orderBy(orderBy as ColumnRef, order as OrderByDirection)

  const result = await findQuery(Item).build(query, itemQuery).withGraphJoined('course').withGraphJoined('fileMeta')
  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const { courseId, title } = req.body
  const exists: any = await Item.query().count().where({ courseId, title }).first()
  if (Number(exists?.count) > 0) throw new apiError(`Judul pelatihan '${title}' sudah terdaftar`, 400)
  const result = await Item.transaction(async (trx) => {
    if (req.file) {
      const { filename, originalname, encoding, mimetype, size } = req.file
      await FileMeta.query(trx).insertGraph({
        filename,
        originalname,
        encoding,
        mimetype,
        size,
        path: `${COURSE_STORAGE}/${filename}`,
      })
    }

    const result = await Item.query(trx).insertGraphAndFetch({
      ...req.body,
      filename: req.file?.filename,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    return result
  })
  return result
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await Item.query().findById(id).withGraphJoined('course').withGraphJoined('fileMeta')
  if (!result) throw new apiError('Pelatihan dengan id yang ditentukan tidak ditemukan', 404)
  return result
})

export const update = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params

  const { courseId, title } = req.body
  const item: any = await Item.query().findById(id)
  if (!item) throw new apiError('Pelatihan dengan id yang ditentukan tidak ditemukan', 404)
  if (item.title !== title) {
    const exists: any = await Item.query().count().where({ courseId, title }).first()
    if (Number(exists?.count) > 0) throw new apiError(`Judul pelatihan '${title}' sudah terdaftar`, 400)
  }

  const result = await Item.transaction(async (trx) => {
    if (req.file) {
      const { filename, originalname, encoding, mimetype, size } = req.file
      await FileMeta.query(trx).insertGraph({
        filename,
        originalname,
        encoding,
        mimetype,
        size,
        path: `${COURSE_STORAGE}/${filename}`,
      })
    }

    const result = await Item.query(trx).patchAndFetchById(id, {
      ...req.body,
      filename: req.file?.filename,
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
  if (!result) throw new apiError('Pelatihan dengan ID yang ditentukan tidak ditemukan', 404)
  return true
})

export const downloadFile = async (req: EGRequest, res: Response) => {
  const id = req.params.id
  const mod = await Item.query().findById(id)
  if (!mod) return res.status(404).send('Fraksi dengan ID yang ditentukan tidak ditemukan')
  if (!mod.filename) return res.status(404).send('File untuk modul dengan ID yang ditentukan tidak ditemukan')

  const fm = await FileMeta.query().findOne({ filename: mod.filename })
  if (!fm) return res.status(404).send('File tidak ditemukan')
  res.setHeader('content-type', fm.mimetype)
  fs.createReadStream(path.resolve(fm.path)).pipe(res)
}

export const getStatistic = wrapAsync(async (req: EGRequest) => {
  const { id, userId } = req.params
  const selector = userId ? { owner: userId, courseExamId: id } : {}

  const item = await Item.query().findById(id)
  if (!item) throw new apiError('Pelatihan dengan ID yang ditentukan tidak ditemukan', 404)

  const totalSubmission: any = await Submission.query()
    .count()
    .where({ ...selector })
    .first()
  const ongoingSubmission: any = await Submission.query()
    .count()
    .where({ ...selector, status: SubmissionStatus.ACTIVE })
    .first()
  const finishedSubmission: any = await Submission.query()
    .count()
    .where({ ...selector, status: SubmissionStatus.FINISHED })
    .first()
  const canceledSubmission: any = await Submission.query()
    .count()
    .where({ ...selector, status: SubmissionStatus.CANCELED })
    .first()

  const avgScore: any = await Submission.query()
    .avg('score')
    .where({ ...selector, status: SubmissionStatus.FINISHED })
    .first()

  const latestScore: any = userId
    ? await Submission.query()
        .findOne({ ...selector, status: SubmissionStatus.FINISHED })
        .orderBy('finishedAt', 'desc')
    : null

  return {
    submission: {
      total: Number(totalSubmission?.count),
      ongoing: Number(ongoingSubmission?.count),
      finished: Number(finishedSubmission?.count),
      canceled: Number(canceledSubmission?.count),
    },
    avgScore: avgScore?.avg,
    latestScore: latestScore?.score || null,
    hasFinished: userId ? (latestScore ? true : false) : undefined,
  }
})

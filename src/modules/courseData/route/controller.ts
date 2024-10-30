import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'
import { register } from '@/modules/auth/service'
import { ScopeSlug } from '@/modules/scope/model'
import CourseData from '../model'
import { COURSE_STORAGE } from '@/constant/env'
import FileMeta from '@/modules/fileMeta/model'

export const index = wrapAsync(async () => {
  const result = await CourseData.query()
  return result
})

export const create = wrapAsync(async (req: EGRequest) => {
  const result = await CourseData.transaction(async (trx) => {
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

    const result = await CourseData.query(trx).insertGraphAndFetch({
      filename: req.file?.filename,
      createdAt: new Date(),
      createdBy: req.user.id,
    })

    return result
  })

  return result
})

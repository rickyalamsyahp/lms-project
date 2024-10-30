import { Router } from 'express'
import * as ctrl from './controller'
import multer from 'multer'
import path from 'path'
import { COURSE_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(COURSE_STORAGE)}`

export const publicRouteCourseData = () => {
  const router: Router = Router()
  router.get(`/`, ctrl.index)
  router.post(`/`, multer({ dest: uploadDest }).single('file'), ctrl.create)
  return router
}

import { Router } from 'express'
import * as ctrl from './controller'
import * as logCtrl from '../ref/log/route/controller'
import * as reportCtrl from '../ref/report/route/controller'
import multer from 'multer'
import path from 'path'
import { isSubmissionCreator } from '@/modules/auth/service'
import { SUBMISSION_LOG_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(SUBMISSION_LOG_STORAGE)}`

export const adminRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.getById)

  router.get('/:submissionId/log', logCtrl.index)
  router.get('/:submissionId/log/:id', isSubmissionCreator(), logCtrl.download)

  router.get('/:submissionId/report', reportCtrl.index)
  router.get('/:submissionId/report/:id', isSubmissionCreator(), reportCtrl.download)
  return router
}

export const instructorRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  router.post('/', ctrl.create)
  router.get('/:id', ctrl.getById)
  router.delete('/:id', ctrl.remove)

  router.put('/:id/cancel', isSubmissionCreator('id'), ctrl.cancel)
  router.put('/:id/finish', isSubmissionCreator('id'), ctrl.finish)

  router.get('/:submissionId/log', logCtrl.index)
  router.post('/:submissionId/log', isSubmissionCreator(), multer({ dest: uploadDest }).single('file'), logCtrl.create)
  router.get('/:submissionId/log/:id', isSubmissionCreator(), logCtrl.download)
  router.delete('/:submissionId/log/:id', isSubmissionCreator(), logCtrl.remove)

  router.get('/:submissionId/report', reportCtrl.index)
  router.post('/:submissionId/report', isSubmissionCreator(), multer({ dest: uploadDest }).single('file'), reportCtrl.create)
  router.get('/:submissionId/report/:id', isSubmissionCreator(), reportCtrl.download)
  router.delete('/:submissionId/report/:id', isSubmissionCreator(), reportCtrl.remove)
  return router
}

export const publicRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  return router
}

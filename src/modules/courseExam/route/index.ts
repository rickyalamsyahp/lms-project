import { Router } from 'express'
import * as ctrl from './controller'
import * as settingCtrl from '../ref/setting/route/controller'
import multer from 'multer'
import path from 'path'
import { COURSE_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(COURSE_STORAGE)}`

export const adminRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.post('/', multer({ dest: uploadDest }).single('file'), ctrl.create)
  router.get('/:id', ctrl.getById)
  router.put('/:id', multer({ dest: uploadDest }).single('file'), ctrl.update)
  router.delete('/:id', ctrl.remove)

  router.get('/:courseExamId/setting', settingCtrl.index)
  router.post('/:courseExamId/setting', settingCtrl.create)
  router.get('/:courseExamId/setting/:id', settingCtrl.getById)
  router.put('/:courseExamId/setting/:id', settingCtrl.update)
  router.delete('/:courseExamId/setting/:id', settingCtrl.remove)

  return router
}

export const instructorRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.post('/', multer({ dest: uploadDest }).single('file'), ctrl.create)
  router.get('/:id', ctrl.getById)
  router.put('/:id', multer({ dest: uploadDest }).single('file'), ctrl.update)
  router.delete('/:id', ctrl.remove)

  router.get('/:courseExamId/setting', settingCtrl.index)
  router.post('/:courseExamId/setting', settingCtrl.create)
  router.get('/:courseExamId/setting/:id', settingCtrl.getById)
  router.put('/:courseExamId/setting/:id', settingCtrl.update)
  router.delete('/:courseExamId/setting/:id', settingCtrl.remove)
  return router
}
export const publicRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.getById)
  router.get('/:id/download', ctrl.downloadFile)
  router.get('/:courseExamId/setting/:id', settingCtrl.getById)
  router.get('/:id/stats', ctrl.getStatistic)
  router.get('/:id/stats/:userId', ctrl.getStatistic)
  return router
}

import { Router } from 'express'
import * as ctrl from './controller'
import multer from 'multer'
import path from 'path'
import { MODULE_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(MODULE_STORAGE)}`

export const adminRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.post('/', multer({ dest: uploadDest }).single('file'), ctrl.create)
  router.get('/:id', ctrl.getById)
  router.put('/:id', multer({ dest: uploadDest }).single('file'), ctrl.update)
  router.delete('/:id', ctrl.remove)
  router.put('/:id/publish', ctrl.publish)
  return router
}

export const instructorRoute = () => {
  const router = Router()
  router.get('/')
  return router
}

export const publicRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.getById)
  router.get('/:id/download', ctrl.downloadFile)
  return router
}

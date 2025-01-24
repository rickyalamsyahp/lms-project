import { Router } from 'express'
import * as ctrl from './controller'
import multer from 'multer'
import path from 'path'
import { COURSE_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(COURSE_STORAGE)}`

export const adminRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.post('/',  ctrl.create)
  router.get('/:id', ctrl.getById)
  router.put('/:id',  ctrl.update)
  router.delete('/:id', ctrl.remove)
  return router
}

// export const instructorRoute = () => {
//   const router = Router()
//   router.get('/', ctrl.index)
//   router.get('/:id', ctrl.getById)
//   router.get('/:id/download', ctrl.downloadFile)
//   return router
// }

// export const publicRoute = () => {
//   const router = Router()
//   router.get('/', ctrl.index)
//   router.get('/:id', ctrl.getById)
//   router.get('/:id/download', ctrl.downloadFile)
//   router.get('/:id/stats', ctrl.getStatistic)
//   router.get('/:id/stats/:userId', ctrl.getStatistic)
//   return router
// }

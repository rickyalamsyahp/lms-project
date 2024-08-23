import { Router } from 'express'
import * as ctrl from './controller'
import multer from 'multer'
import path from 'path'
import { PROFILE_PICTURE_STORAGE } from '@/constant/env'

const uploadDest = `${path.resolve(PROFILE_PICTURE_STORAGE)}`

export const myProfile = () => {
  const router: Router = Router()
  router.put(`/change-password`, ctrl.changePassword)
  router.get(`/`, ctrl.getProfile)
  router.put('/', ctrl.updateProfile)
  router.get('/avatar', ctrl.getAvatar)
  router.put('/avatar', multer({ dest: uploadDest }).single('file'), ctrl.changeAvatar)
  return router
}

export const adminRoute = () => {
  const router: Router = Router()
  router.post(`/`, ctrl.createUser)
  router.get(`/scope/:scope`, ctrl.getUserByScope)

  router.get(`/:id`, ctrl.getById)
  router.put('/:id', ctrl.updateProfile)
  router.delete(`/:id`, ctrl.remove)
  router.put(`/:id/activate`, ctrl.activate)
  router.put(`/:id/change-password`, ctrl.changePassword)
  router.put('/:id/avatar', multer({ dest: uploadDest }).single('file'), ctrl.changeAvatar)

  return router
}

export const instructorRoute = () => {
  const router: Router = Router()
  router.get(`/`, ctrl.getUserByScope)
  router.post(`/`, ctrl.createUser)
  router.get(`/:id`, ctrl.getById)
  router.put('/:id', ctrl.updateProfile)
  router.delete(`/:id`, ctrl.remove)
  router.put('/:id/avatar', multer({ dest: uploadDest }).single('file'), ctrl.changeAvatar)

  return router
}

export const publicRoute = () => {
  const router: Router = Router()
  router.get(`/:id`, ctrl.getById)

  return router
}

export const openRoute = () => {
  const router: Router = Router()
  router.get('/:id/avatar', ctrl.getAvatar)

  return router
}

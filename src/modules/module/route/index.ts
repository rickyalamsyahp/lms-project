import { Router } from 'express'
import * as ctrl from './controller'

export const adminRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.post('/', ctrl.create)
  router.get('/:id', ctrl.getById)
  router.put('/:id', ctrl.update)
  router.delete('/:id', ctrl.remove)
  router.put('/:id/publish', ctrl.publish)
  return router
}

export const publicRoute = () => {
  const router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.getById)
  return router
}

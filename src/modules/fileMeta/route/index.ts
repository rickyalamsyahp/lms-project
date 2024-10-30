import { Router } from 'express'
import * as ctrl from './controller'

export const publicRoute = () => {
  const router = Router()
  router.get('/:filename', ctrl.downloadFile)
  return router
}

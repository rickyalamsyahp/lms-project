import { Router } from 'express'
import * as ctrl from './controller'

export const publicRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.getIndex)
  return router
}

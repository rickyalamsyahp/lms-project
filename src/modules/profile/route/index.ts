import { Router } from 'express'
import * as ctrl from './controller'
export const siswaRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.getProfile)
  return router
}

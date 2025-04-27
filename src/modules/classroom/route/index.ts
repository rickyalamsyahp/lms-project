import { Router } from 'express'
import * as ctrl from './controller'

export const guruRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.getKelas)
  return router
}

export const siswaRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.getKelas)
  return router
}

export const publicRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.getKelas)
  return router
}

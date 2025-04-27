import { Router } from 'express'
import * as ctrl from './controller'
export const ExamResultGuruRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  return router
}

export const ExamResultSiswaRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  return router
}

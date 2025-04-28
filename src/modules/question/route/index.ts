import { Router } from 'express'
import * as ctrl from './controller'

export const siswaRoute = () => {
  const router: Router = Router()
  router.get('/:id', ctrl.indexId)
  router.post('/', ctrl.postExamResult)
  return router
}

export const guruRoute = () => {
  const router: Router = Router()
  router.get('/:id', ctrl.indexId)
  return router
}

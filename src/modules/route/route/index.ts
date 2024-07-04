import { Router } from 'express'
import * as ctrl from './controller'

export default () => {
  const router: Router = Router()
  router.get('/mrt', ctrl.mrtIndex)
  return router
}

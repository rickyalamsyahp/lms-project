import { Router, Express } from 'express'
import * as ctrl from './controller'

export default (app: Express) => {
  const router: Router = Router()

  return router.get(`/`, ctrl.index)
}

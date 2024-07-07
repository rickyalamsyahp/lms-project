import { Router } from 'express'
import * as ctrl from './controller'

export default () => {
  const router: Router = Router()
  router.post('/authorize', ctrl.signIn)
  router.post('/register', ctrl.signUp)
  return router
}

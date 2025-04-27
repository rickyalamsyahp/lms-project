import { Router } from 'express'
import * as ctrl from './controller'
export const BankSoalRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.indexByid)
  router.post('/', ctrl.store)
  router.put('/:id', ctrl.update)
  router.delete('/:id', ctrl.destroy)
  return router
}

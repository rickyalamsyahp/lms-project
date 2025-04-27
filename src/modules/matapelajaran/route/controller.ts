import wrapAsync from '@/libs/wrapAsync'

import Matapelajaran from '../model'

export const getIndex = wrapAsync(async (req: any) => {
  const qb = Matapelajaran.query()
  if (req.query.kodeMapel) {
    qb.where('kode', '=', req.query.kodeMapel)
  }

  const result = await qb

  return result
})

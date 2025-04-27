import wrapAsync from '@/libs/wrapAsync'

import MapMatapelajaranKelas from '../model'

export const getIndex = wrapAsync(async (req: any) => {
  const qb = MapMatapelajaranKelas.query()
  if (req.query.kodeMapel) {
    qb.where('matapelajaran', 'like', `%#${req.query.kodeMapel}%`)
  }
  if (req.query.semester) {
    qb.where('semester', '=', `${req.query.semester}`)
  }

  const result = await qb

  return result
})

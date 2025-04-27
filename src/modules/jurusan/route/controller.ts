import wrapAsync from '@/libs/wrapAsync'

import Jurusan from '../model'

export const getKelas = wrapAsync(async (req: any) => {
  const qb = Jurusan.query()
  if (req.user.role === 'siswa') {
    qb.where('kode', '=', req.user.kodeKelas)
  }
  if (req.user.role === 'guru') {
    if (req.query.kelasId) {
      qb.where('kode', '=', req.query.kelasId)
    }
  }
  // qb.where('kodeGuru', '=', req.user.kode)

  const result = await qb
  return result
})

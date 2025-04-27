import wrapAsync from '@/libs/wrapAsync'

import Classroom from '../model'

export const getKelas = wrapAsync(async (req: any) => {
  const qb = Classroom.query()
  if (req.user.role === 'siswa') {
    qb.where('kode', '=', req.user.kodeKelas)
  }
  if (req.user.role === 'guru') {
    if (req.query.kelasId) {
      const kelasIdArray = Array.isArray(req.query.kelasId)
        ? req.query.kelasId
        : typeof req.query.kelasId === 'string'
        ? req.query.kelasId.split(',') // kalau kirim string "12,23,45"
        : []

      qb.whereIn('kode', kelasIdArray)
    }
  }
  // qb.where('kodeGuru', '=', req.user.kode)

  const result = await qb
  return result
})

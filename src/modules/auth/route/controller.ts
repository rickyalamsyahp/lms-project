import { COOKIE_MAX_AGE } from '@/constant/env'
import { apiError } from '@/libs/apiError'
import wrapAsync from '@/libs/wrapAsync'
import Student from '@/modules/student/model'
import Teacher from '@/modules/teacher/model'
import { Request, Response } from 'express'
import { signToken } from '../service'
import { getDbConnection } from '@/middleware/db/sql'
// import dbConnection from '@/middleware/db'

export const signIn = wrapAsync(async (req: Request, res: Response) => {
  const { nis, nisn, uidg, upwdg, thn_pelajaran } = req.body
  if (!thn_pelajaran) throw new apiError('Tahun pelajaran wajib diisi', 400)

  const sql = await getDbConnection(thn_pelajaran)
  // console.log(sql)

  let user: any
  if (nis && nisn) {
    user = await Student.query().where({ nis, nisn }).first()
    if (!user) throw new apiError(`data tidak sesuai`, 400)
    user.role = 'siswa'
  } else {
    user = await Teacher.query().where({ uidg, upwdg }).first()
    if (!user) throw new apiError(`data tidak sesuai`, 400)
    user.role = 'guru'
  }

  const accessToken = signToken(user)
  res.cookie('access-token', accessToken, { maxAge: Number(COOKIE_MAX_AGE), path: '/' })
  return { accessToken, user, thn_pelajaran }
})

// export const signUp = wrapAsync(async (req: Request) => {
//   const user: any = await register(req.body, ScopeSlug.ADMIN, true)
//   return user
// })

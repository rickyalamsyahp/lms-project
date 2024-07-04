import wrapAsync from '@/libs/wrapAsync'
import User from '@/modules/user/model'
import { Request, Response } from 'express'
import { authenticate, signToken } from '../service'
import { apiError } from '@/libs/apiError'
import { ScopeSlug } from '@/modules/scope/model'
import { register } from '../service'
import { COOKIE_MAX_AGE } from '@/constant/env'

export const signIn = wrapAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await User.query().where({ username }).first()
  if (!user) throw new apiError(`Username atau password tidak sesuai`, 400)
  if (!user.isActive) throw new apiError('User tidak aktif. Silahkan hubungi administrator', 403)

  if (!authenticate(password, user.salt, user.hashedPassword)) throw new apiError('Username atau password tidak sesuai', 400)

  const accessToken = signToken(user)
  res.cookie('access-token', accessToken, { maxAge: Number(COOKIE_MAX_AGE), path: '/' })
  return accessToken
})

export const signUp = wrapAsync(async (req: Request) => {
  const user: any = await register(req.body, ScopeSlug.TRAINEE, true)
  return user
})

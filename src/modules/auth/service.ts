import crypto from 'crypto'
import { NextFunction, Response } from 'express'
import { expressjwt } from 'express-jwt'
import compose from 'composable-middleware'
import jwtDecode from 'jwt-decode'
import jwt, { SignOptions } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { apiError, errorHandler } from '@/libs/apiError'
import { EGRequest } from '@/constant/type'
import { JWT_EXPIRES_IN, JWT_SECRET } from '@/constant/env'

type UserData = {
  name: string
  email: string
  username: string
  password: string
  createdBy: string
  createdAt: Date
}

export const validateJwt = expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'] })
console.log(validateJwt)

export const makeSalt = () => {
  return crypto.randomBytes(16).toString('base64')
}

export const encryptPassword = (password: string, salt: string) => {
  const parsedSalt = Buffer.from(salt, 'base64')
  return crypto.pbkdf2Sync(password, parsedSalt, 10000, 64, 'sha1').toString('base64')
}

export const authenticate = (password: string, salt: string, hashedPassword: string) => {
  return encryptPassword(password, salt) === hashedPassword
}

export const signToken = (user: any) => {
  const jwtOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  }

  return jwt.sign(
    {
      id: user.id,
      scope: user.role,
      name: user.nama,
      ...user,
    },
    JWT_SECRET,
    jwtOptions
  )
}

export const isAuthenticated = (scopes = []) => {
  return compose()
    .use((req: Request | any, res: Response | any, next: NextFunction) => {
      const accessToken = String(req.headers.authorization || req.query.access_token).replace('Bearer ', '')
      if (!accessToken) return res.status(401).send('Unauthorized')
      req.headers.authorization = `Bearer ${accessToken}`
      validateJwt(req, res, (err: any) => {
        const decoded: any = jwtDecode(accessToken)
        if (scopes.length > 0 && !scopes.includes(decoded.scope)) return res.status(403).send('Kamu tidak diperkenankan untuk mengakses')
        req.user = decoded
        next()
      })
    })
    .use(async (req: Request | any, res: Response | any, next: NextFunction) => {
      // req.user = await User.query().findById(req.user.id)
      // if (!req.user) return res.status(401).send('User tidak ditemukan')
      // if (!req.user.isActive) return res.status(403).send('User tidak aktif')
      const method = req.method.toLowerCase()
      if (method === 'post' || method === 'put') {
        delete req.body.id
        delete req.body.createdBy
        delete req.body.modifiedBy
        delete req.body.createdAt
        if (method === 'post') {
          req.body.createdBy = req.user.id
          req.body.createdAt = new Date()
        } else if (method === 'put') {
          req.body.modifiedBy = req.user.id
          req.body.modifiedAt = new Date()
        }
      }
      next()
    })
}

import wrapAsync from '@/libs/wrapAsync'
import User from '../model'
import { apiError } from '@/libs/apiError'
import findQuery from 'objection-find'
import { changePassword as authChangePassword, register } from '@/modules/auth/service'
import { EGRequest } from '@/constant/type'
import path from 'path'
import { Response } from 'express'
import fs from 'fs'
import FileMeta from '@/modules/fileMeta/model'
import { ScopeSlug } from '@/modules/scope/model'
import UserBio from '../ref/bio/model'
import { PROFILE_PICTURE_STORAGE } from '@/constant/env'
import { ColumnRef, OrderByDirection } from 'objection'

export const index = wrapAsync(async () => {
  const result = await User.query()
  return result
})

export const getById = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params
  const result = await User.query().findById(id).withGraphJoined('bio')
  if (!result) throw new apiError(`User dengan ID yang ditentukan tidak ditemukan`, 404)
  return result
})

export const getUserByScope = wrapAsync(async (req: EGRequest) => {
  const { page = 1, size = 20, order = 'desc', orderBy = 'createdAt', ...query } = req.query
  const result = await findQuery(User).build(
    query,
    User.query()
      .where({
        scope: req.isAdmin ? req.params.scope : ScopeSlug.TRAINEE,
      })
      .page(Number(page) - 1, Number(size))
      .orderBy(orderBy as ColumnRef, order as OrderByDirection)
      .withGraphJoined('bio')
  )
  return result
})

export const activate = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params

  const user = await User.query().findById(id)
  if (user.username === 'admin') throw new apiError('User ini tidak dapat di inaktivasi!', 400)
  const result = await user.$query().updateAndFetch({
    isActive: !user.isActive,
    username: user.username,
    name: user.name,
  })

  return result
})

export const changePassword = wrapAsync(async (req: EGRequest) => {
  const { newPassword, oldPassword } = req.body
  const { id } = req.params
  const asOwner = !id
  if (!newPassword && (asOwner ? !oldPassword : false)) throw new apiError(`Password baru atau password lama tidak boleh kosong`, 400)
  const message = await authChangePassword(asOwner ? req.user.id : id, newPassword, oldPassword, asOwner)
  return message
})

export const getProfile = wrapAsync(async (req: EGRequest) => {
  const { id } = req.user
  const result = await User.query().findById(id).withGraphJoined('bio')
  if (!result) throw new apiError('Profil tidak ditemukan', 404)
  return result
})

export const updateProfile = wrapAsync(async (req: EGRequest) => {
  const asOwner = req.params.id ? false : true
  const id = asOwner ? req.user.id : req.params.id
  const q = User.query().findById(id)
  if (!asOwner && !req.isAdmin) q.where({ scope: ScopeSlug.TRAINEE })
  const user = await q
  if (!user) throw new apiError('User dengan id yang ditentukan tidak ditemukan', 404)
  if (user.createdBy === 'system') throw new apiError('User ini tidak dapat diubah!', 400)

  const { name, email, username = req.user.username, bio } = req.body
  const userBio = await UserBio.query().findOne({ userId: id })
  await User.transaction(async (trx) => {
    if (bio) {
      const { born, gender, phoneNumber, identityNumber, position } = bio
      if (userBio)
        await UserBio.query(trx)
          .patch({
            gender,
            phoneNumber,
            born,
            identityNumber,
            position,
          })
          .where({ userId: id })
      else
        await UserBio.query(trx).insertGraph({
          gender,
          phoneNumber,
          born,
          identityNumber,
          userId: id,
        })
    }

    await user.$query(trx).patchAndFetch({
      name,
      email,
      username,
      modifiedBy: id,
      modifiedAt: new Date(),
    })

    return
  })

  const result = await User.query().findById(id).withGraphJoined('bio')
  return result
})

export const createUser = wrapAsync(async (req: EGRequest) => {
  const { username, name, email, password, scope, bio } = req.body

  const result = await register(
    {
      username,
      name,
      email,
      password,
      createdBy: req.user.id,
      createdAt: new Date(),
    },
    req.isInstructor ? ScopeSlug.TRAINEE : scope,
    true,
    bio
  )

  return result
})

export const changeAvatar = wrapAsync(async (req: EGRequest & { file: any }) => {
  if (!req.file) throw new apiError('File tidak boleh kosong', 400)
  const id = req.isAdmin && req.params.id ? req.params.id : req.user.id
  const user = await User.query().findById(id)
  if (!user) throw new apiError(`User tidak ditemukan`, 404)

  const { filename, originalname, encoding, mimetype, size } = req.file
  await FileMeta.query().insertGraph({
    filename,
    originalname,
    encoding,
    mimetype,
    size,
    path: `${PROFILE_PICTURE_STORAGE}/${filename}`,
  })

  const { name, email, username } = user
  const result = await user.$query().updateAndFetch({
    username,
    name,
    email,
    avatar: filename,
    modifiedBy: id,
    modifiedAt: new Date(),
  })

  return result
})

export const getAvatar = async (req: EGRequest, res: Response) => {
  const id = req.params?.id || req.user.id
  const user = await User.query().findById(id)
  if (!user) return res.status(404).send(`User dengan ID yang ditentukan tidak ditemukan`)
  if (!user.avatar) return res.status(404).send(`User dengan ID yang ditentukan tidak memiliki avatar`)

  const fm = await FileMeta.query().findOne({ filename: user.avatar })
  if (!fm) return res.status(404).send('File tidak ditemukan')
  res.setHeader('content-type', fm.mimetype)
  fs.createReadStream(path.resolve(fm.path)).pipe(res)
}

export const remove = wrapAsync(async (req: EGRequest) => {
  const { id } = req.params

  const q = User.query().findById(id).andWhereNot({ createdBy: 'system' })
  if (!req.isAdmin || !req.isInstructor) q.where({ scope: ScopeSlug.TRAINEE })
  const user = await q

  if (!user) throw new apiError('User dengan id yang ditentukan tidak ditemukan atau merupakan akun yang dibuat system', 404)
  if (user.username === 'admin') throw new apiError('User ini tidak dapat dihapus!', 400)

  await User.transaction(async (trx) => {
    await UserBio.query(trx).delete().where({ userId: id })
    await User.query(trx).deleteById(id)
    return
  })

  return true
})

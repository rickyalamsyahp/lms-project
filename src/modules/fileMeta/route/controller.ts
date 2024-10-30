import { Response } from 'express'
import FileMeta from '../model'
import fs from 'fs'
import path from 'path'
import { EGRequest } from '@/constant/type'

export const downloadFile = async (req: EGRequest, res: Response) => {
  const { filename } = req.params
  const fm = await FileMeta.query().findOne({ filename })
  if (!fm) return res.status(404).send('File tidak ditemukan')
  res.setHeader('content-type', fm.mimetype)
  res.setHeader('Content-Disposition', `attachment; filename="${fm.originalname}"`)
  fs.createReadStream(path.resolve(fm.path)).pipe(res)
}

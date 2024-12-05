import { Response } from 'express'
import FileMeta from '../model'
import fs from 'fs'
import path from 'path'
import { EGRequest } from '@/constant/type'

export const downloadFile = async (req: EGRequest, res: Response) => {
  try {
    const { filename } = req.params
    const fm = await FileMeta.query().findOne({ filename })

    if (!fm) return res.status(404).send('File tidak ditemukan')

    const filePath = path.resolve(fm.path)
    const stat = fs.statSync(filePath) // Mendapatkan informasi file
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      // Jika browser mengirimkan header "Range"
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize || end >= fileSize) {
        res.status(416).send('Requested range not satisfiable')
        return
      }

      const chunkSize = end - start + 1
      const fileStream = fs.createReadStream(filePath, { start, end })

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': fm.mimetype,
      })

      fileStream.pipe(res)
    } else {
      // Jika tidak ada header "Range", kirim seluruh file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': fm.mimetype,
      })

      fs.createReadStream(filePath).pipe(res)
    }
  } catch (error) {
    console.error('Error serving file:', error)
    res.status(500).send('Internal server error')
  }
}

import { Router } from 'express'
import * as ctrl from './controller'
import path from 'path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const uploadDestImage = path.resolve('./uploads/images')
const uploadDestAudio = path.resolve('./uploads/audio')

if (!fs.existsSync(uploadDestImage)) fs.mkdirSync(uploadDestImage, { recursive: true })
if (!fs.existsSync(uploadDestAudio)) fs.mkdirSync(uploadDestAudio, { recursive: true })

// Multer disk storage config
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDestImage),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDestAudio),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

// Filters
const imageFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('Only image files are allowed!'), false)
}

const audioFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('audio/')) cb(null, true)
  else cb(new Error('Only audio files are allowed!'), false)
}

// Multer middleware
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('file')

const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file')

export const BankSoalRoute = () => {
  const router: Router = Router()
  router.get('/', ctrl.index)
  router.get('/:id', ctrl.indexByid)
  router.post('/', ctrl.store)
  router.post('/image', uploadImage, ctrl.uploadImageFile)
  router.post('/audio', uploadAudio, ctrl.uploadAudioFile)
  router.put('/:id', ctrl.update)
  router.delete('/:id', ctrl.destroy)
  return router
}

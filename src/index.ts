import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dbConnection from './middleware/db'
import api from './middleware/api'
import { BODY_LIMIT, CORS_HEADERS, PORT } from './constant/env'
import swagger from './middleware/swagger'
import path from 'path'

const app = express()
const server = http.createServer(app)

app.use(morgan('dev'))

app.use(
  cors({
    exposedHeaders: CORS_HEADERS?.split(','),
  })
)
app.use('/Replays', express.static('\\\\192.168.10.6\\Replays$\\Video'))
app.use(
  bodyParser.json({
    limit: BODY_LIMIT,
  })
)

swagger(app)

dbConnection(() => {
  api(app)
  const port = PORT || '8080'
  server.listen(port, () => {
    console.log(`Started on port ${port}`)
  })
})

export default app

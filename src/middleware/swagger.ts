import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { Express } from 'express'
import { API_GATEWAY, NODE_ENV } from '@/constant/env'

export default (app: Express) => {
  const isProduction = NODE_ENV === 'production'
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API User Service',
        version: '1.0.0',
      },
      servers: [
        {
          url: API_GATEWAY,
        },
      ],
    },
    apis: [`${process.cwd()}${isProduction ? '/' : '/src/'}middleware/api/docs/*.${isProduction ? 'js' : 'ts'}`],
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
}

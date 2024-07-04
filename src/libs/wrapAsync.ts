import { Request, Response } from 'express'

export default (handler: any) => (req: Request, res: Response) =>
  handler(req, res)
    .then((result: any) => res.json(result))
    .catch((error: any) => {
      let message
      let statusCode = error.statusCode || 500
      switch (error.code) {
        case '23502':
          message = error.message
          statusCode = 400
          break
        case '23503':
          message = 'This record can’t be deleted because another record refers to it'
          statusCode = 400
          break
        case '23505':
          message = 'This record contains duplicated data that conflicts with what is already in the database'
          statusCode = 400
          break
        case '23514':
          message = 'This record contains inconsistent or out-of-range data'
          statusCode = 400
          break
        default:
          message = error.message
      }

      const errResult: any = { errorMessage: message }
      if (error.detail) {
        const details: any = {}
        error.detail.split('.').forEach((item: any) => {
          const a = item.split('=')
          if (a.length > 1 && a[0]) {
            details[a[0].replace(/Key \(|\)/gm, '') as keyof typeof details] = a[1].replace(/\(|\)/gm, '')
          }
        })

        if (Object.keys(details).length > 0) errResult.errorValidation = details
      }

      res.status(statusCode).json(errResult)
    })

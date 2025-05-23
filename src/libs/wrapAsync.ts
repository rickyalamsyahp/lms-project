import { Request, Response } from 'express'

export default (handler: any) => (req: Request, res: Response) =>
  handler(req, res)
    .then((result: any) => res.json(result))
    .catch((error: any) => {
      let message
      let statusCode = error.statusCode || 500
      switch (error?.nativeError?.code) {
        case '23502':
          message = error.message
          statusCode = 400
          break
        case '23503':
          message = 'Data record ini tidak dapat dihapus karena data lain merujuk padanya, atau data rujukan tidak ditemukan'
          statusCode = 400
          break
        case '23505':
          message = 'Berisi data duplikat yang bertentangan dengan data yang sudah ada di database'
          statusCode = 400
          break
        case '23514':
          message = 'Data record ini berisi data yang tidak konsisten atau di luar jangkauan'
          statusCode = 400
          break
        default:
          message = error.message
      }

      const errResult: any = { errorMessage: message }
      if (error?.nativeError?.detail) {
        const details: any = {}
        error.nativeError.detail.split('.').forEach((item: any) => {
          const a = item.split('=')
          if (a.length > 1 && a[0]) {
            details[a[0].replace(/Key \(|\)/gm, '') as keyof typeof details] = a[1].replace(/\(|\)/gm, '')
          }
        })

        if (Object.keys(details).length > 0) errResult.errorValidation = details
      }

      res.status(statusCode).json(errResult)
    })

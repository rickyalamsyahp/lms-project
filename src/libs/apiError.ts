export class apiError extends Error {
  statusCode = 500
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (error: any) => {
  console.log(error)
  const { response } = error
  if (response) {
    const { status, data, message } = response
    throw new apiError(data?.errorMessage || data?.error_message || data?.message || data || message, status)
  }

  throw error
}

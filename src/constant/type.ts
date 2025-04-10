import { Request } from 'express'

export type EGUser = {
  id: string
  username: string
  apiKey: string
  scope: string
}

export type EGRequest = Request & {
  user: EGUser
  isAdmin?: boolean
  isInstructor?: boolean
  isTrainee?: boolean
}

import { EGRequest } from '@/constant/type'
import wrapAsync from '@/libs/wrapAsync'

export const getProfile = wrapAsync(async (req: EGRequest) => {
  return req.user
})

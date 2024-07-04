import { mrtRoutes } from '@/constant/routes'
import wrapAsync from '@/libs/wrapAsync'

export const mrtIndex = wrapAsync(async () => {
  await Promise.resolve()
  return mrtRoutes
})

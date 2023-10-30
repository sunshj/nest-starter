import { $Enums } from '@prisma/client'

declare global {
  type DeepUnpacked<T> = T extends (infer U)[]
    ? U[]
    : T extends object
    ? { [K in keyof T]: DeepUnpacked<T[K]> }
    : T

  interface UserPayload {
    sub: number
    username: string
    role: $Enums.Role
  }
}

declare module 'express' {
  interface Request {
    user: UserPayload
  }
}

export {}

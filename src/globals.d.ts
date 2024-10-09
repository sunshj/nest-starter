import { $Enums } from '@prisma/client'

declare global {
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

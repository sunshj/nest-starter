import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const User = createParamDecorator((data: keyof UserPayload, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<Request>()
  return data ? user[data] : user
})

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { $Enums } from '@prisma/client'
import { Request } from 'express'
import { ROLES_KEY } from '../decorators'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<$Enums.Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) return true
    try {
      const { user } = context.switchToHttp().getRequest<Request>()
      const isAllowed = requiredRoles.includes(user.role)
      if (!isAllowed) throw new ForbiddenException('权限不足')
      return true
    } catch (error) {
      throw new ForbiddenException(error.message)
    }
  }
}

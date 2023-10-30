import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { $Enums } from '@prisma/client'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ROLES_KEY } from '../decorators'

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<$Enums.Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) return true
    const { user } = context.switchToHttp().getRequest<Request>()
    const isAllowed = requiredRoles.some(role => user.role === role)
    if (!isAllowed) throw new ForbiddenException('权限不足')
    return true
  }
}

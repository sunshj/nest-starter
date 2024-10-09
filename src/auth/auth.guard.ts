import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY, IS_REFRESH_TOKEN } from '~/common/decorators'
import { EnvironmentVariables } from '~/config/env'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private config: ConfigService<EnvironmentVariables>,
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true

    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(IS_REFRESH_TOKEN, [
      context.getHandler(),
      context.getClass()
    ])

    const req = context.switchToHttp().getRequest<Request>()
    const token = this.authService.extractTokenFromHeader(req)
    if (!token) throw new UnauthorizedException('token not found')
    const payload = await this.authService.verifyToken(
      token,
      this.config.get(isRefreshToken ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET')
    )

    if (!payload) throw new UnauthorizedException('invalid token')
    req.user = payload

    return true
  }
}

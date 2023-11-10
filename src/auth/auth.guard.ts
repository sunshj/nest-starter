import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '~/user/user.service'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '~/common/decorators'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const token = this.extractTokenFromHeader(req)
    if (!token) throw new UnauthorizedException('token不存在')
    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token)
      const { name, role } = await this.userService.findOne(payload.sub)
      const newPayload: UserPayload = { sub: payload.sub, username: name, role }
      req.user = newPayload
      const newToken = await this.jwtService.signAsync(newPayload)
      res.setHeader('Authorization', `Bearer ${newToken}`)
    } catch (error) {
      throw new UnauthorizedException('无效token')
    }
    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

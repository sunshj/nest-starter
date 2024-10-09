import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { EnvironmentVariables } from '~/config/env'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService<EnvironmentVariables>
  ) {}

  async verifyToken(token: string, secret: string) {
    try {
      const { sub, username, role } = await this.jwtService.verifyAsync(token, { secret })
      return { sub, username, role }
    } catch {
      return null
    }
  }

  async generateAccessToken(payload: UserPayload) {
    return await this.jwtService.signAsync(
      { ...payload, t: 'a' },
      { expiresIn: 60, secret: this.config.get('ACCESS_TOKEN_SECRET') }
    )
  }

  async generateRefreshToken(payload: UserPayload) {
    return await this.jwtService.signAsync(
      { ...payload, t: 'r' },
      { expiresIn: 60 * 2, secret: this.config.get('REFRESH_TOKEN_SECRET') }
    )
  }

  extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

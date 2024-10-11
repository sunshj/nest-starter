import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { Request } from 'express'
import { EnvironmentVariables } from '~/config/env'
import { UserService } from '~/user/user.service'
import { PrettyResult } from '~/utils'
import { SignInDto, SignUpDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService<EnvironmentVariables>
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByName(signInDto.name)
    if (!user) throw new Error('用户名不存在')
    const matches = await compare(signInDto.password, user.password)
    if (!matches) throw new Error('密码错误')

    const payload = { sub: user.id, username: user.name, role: user.role }
    const access_token = await this.generateAccessToken(payload)
    const refresh_token = await this.generateRefreshToken(payload)

    return {
      user,
      access_token,
      refresh_token
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const existUser = await this.userService.findByName(signUpDto.name)
    if (existUser && existUser.name === signUpDto.name) return PrettyResult.failed('用户已存在')
    const user = await this.userService.create({ ...signUpDto, role: 'USER' })
    if (!user) return PrettyResult.failed('注册失败')
    return PrettyResult.success(user, { message: '注册成功' })
  }

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
      {
        expiresIn: 60 * 20 /** 20min */,
        secret: this.config.get('ACCESS_TOKEN_SECRET')
      }
    )
  }

  async generateRefreshToken(payload: UserPayload) {
    return await this.jwtService.signAsync(
      { ...payload, t: 'r' },
      {
        expiresIn: 60 * 60 * 24 * 30 /** 30days */,
        secret: this.config.get('REFRESH_TOKEN_SECRET')
      }
    )
  }

  extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

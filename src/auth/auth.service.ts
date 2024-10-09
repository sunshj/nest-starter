import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { UserService } from '~/user/user.service'
import { PrettyResult } from '~/utils'
import { SignInDto, SignUpDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn({ name, password }: SignInDto) {
    const user = await this.userService.findByName(name)
    if (!user) return PrettyResult.success('用户名不存在')
    const matches = await compare(password, user.password)
    if (!matches) return PrettyResult.failed('密码错误')
    const payload = { sub: user.id, username: user.name, role: user.role } satisfies UserPayload
    const access_token = await this.jwtService.signAsync(payload)
    return PrettyResult.success(
      { user, access_token: `Bearer ${access_token}` },
      { message: '登录成功' }
    )
  }

  async signUp(signUpDto: SignUpDto) {
    const { name } = signUpDto
    const existUser = await this.userService.findByName(name)
    if (existUser && existUser.name === name) return PrettyResult.failed('用户已存在')
    const user = await this.userService.create({ ...signUpDto, role: 'USER' })
    if (!user) return PrettyResult.failed('注册失败')
    return PrettyResult.success(user, { message: '注册成功' })
  }
}

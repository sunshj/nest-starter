import { Injectable } from '@nestjs/common'
import { SignInDto, SignUpDto } from './dto'
import { UserService } from '~/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { PrettyResult } from '~/utils'
import { compare } from 'bcryptjs'

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
    return {
      user,
      access_token
    }
  }

  signUp(signUpDto: SignUpDto) {
    console.log(signUpDto)
    throw new Error('method not implement')
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Res,
  UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { compare } from 'bcryptjs'
import { Response } from 'express'
import { Public, RefreshToken, User } from '~/common/decorators'
import { UserService } from '~/user/user.service'
import { PrettyResult } from '~/utils'
import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.findByName(signInDto.name)
    if (!user) return PrettyResult.success('用户名不存在')
    const matches = await compare(signInDto.password, user.password)
    if (!matches) return PrettyResult.failed('密码错误')

    const payload = { sub: user.id, username: user.name, role: user.role }
    const access_token = await this.authService.generateAccessToken(payload)
    const refresh_token = await this.authService.generateRefreshToken(payload)

    res.setHeader('Authorization', access_token)
    res.setHeader('Refresh-Token', refresh_token)
    return PrettyResult.success({ user, access_token, refresh_token }, { message: '登录成功' })
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '注册' })
  async signUp(@Body() signUpDto: SignUpDto) {
    const existUser = await this.userService.findByName(signUpDto.name)
    if (existUser && existUser.name === signUpDto.name) return PrettyResult.failed('用户已存在')
    const user = await this.userService.create({ ...signUpDto, role: 'USER' })
    if (!user) return PrettyResult.failed('注册失败')
    return PrettyResult.success(user, { message: '注册成功' })
  }

  @RefreshToken()
  @Post('refresh_token')
  @ApiOperation({ summary: '刷新token' })
  async refreshToken(@User() user: UserPayload, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.generateAccessToken(user)
    res.setHeader('Authorization', access_token)

    return PrettyResult.success({
      access_token
    })
  }

  @ApiBearerAuth()
  @Get('payload')
  @ApiOperation({ summary: '获取token用户信息' })
  getUser(@User() user: UserPayload) {
    return user
  }
}

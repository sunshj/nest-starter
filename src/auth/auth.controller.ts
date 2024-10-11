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
import { Response } from 'express'
import { Public, RefreshToken, User } from '~/common/decorators'
import { PrettyResult } from '~/utils'
import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    try {
      const { user, access_token, refresh_token } = await this.authService.signIn(signInDto)
      res.setHeader('Authorization', access_token)
      res.setHeader('Refresh-Token', refresh_token)

      return PrettyResult.success({ user, access_token, refresh_token }, { message: '登录成功' })
    } catch (error) {
      return PrettyResult.failed(error.message)
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '注册' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
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

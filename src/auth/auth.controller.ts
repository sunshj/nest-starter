import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { Public, User } from '~/common/decorators'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '登录' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '注册' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @ApiBearerAuth()
  @Get('payload')
  @ApiOperation({ summary: '获取token用户信息' })
  getUser(@User() user: UserPayload) {
    return user
  }
}

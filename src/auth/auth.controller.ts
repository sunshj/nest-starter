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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Public()
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Get('payload')
  getUser(@User() user: UserPayload) {
    return user
  }
}

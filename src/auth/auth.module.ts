import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '~/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from '~/config/env'

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}

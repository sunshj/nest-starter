import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { LoggerModule } from 'nestjs-pino'
import { loggerModuleAsyncParams } from '~/config/logger'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate
    }),
    LoggerModule.forRootAsync(loggerModuleAsyncParams),
    UserModule,
    PrismaModule,
    AuthModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

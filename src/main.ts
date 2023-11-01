import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ResponseInterceptor } from './common/interceptors'
import { AllExceptionFilter, PrismaExceptionFilter } from './common/filters'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from './common/env'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'node:path'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))
  app.enableCors()
  app.useStaticAssets(join(__dirname, '../public'))
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggerErrorInterceptor())
  app.useGlobalFilters(new AllExceptionFilter(), new PrismaExceptionFilter())

  const config = app.get(ConfigService<EnvironmentVariables>)
  const port = config.get('PORT', { infer: true }) || 3000
  await app.listen(port, '0.0.0.0').then(async () => {
    console.log(`🚀 Application is running on: ${await app.getUrl()}`)
  })
}
bootstrap()

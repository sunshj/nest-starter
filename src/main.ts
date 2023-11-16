import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TransformInterceptor } from './common/interceptors'
import { AllExceptionFilter, PrismaExceptionFilter } from './common/filters'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from './config/env'
import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { join } from 'node:path'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })
  app.setGlobalPrefix('api', { exclude: [{ path: '', method: RequestMethod.GET }] })
  const docBuilder = new DocumentBuilder()
    .setTitle('NestJS Starter')
    .setDescription('REST API Document')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
      description: 'JWT Authorization header using the Bearer scheme.',
      scheme: 'bearer',
      in: 'header'
    })
    .build()

  const document = SwaggerModule.createDocument(app, docBuilder)
  SwaggerModule.setup('api', app, document)

  app.useLogger(app.get(Logger))
  app.enableCors()
  app.useStaticAssets(join(__dirname, '../public'))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggerErrorInterceptor())
  app.useGlobalFilters(new AllExceptionFilter(), new PrismaExceptionFilter())

  const config = app.get(ConfigService<EnvironmentVariables>)
  const port = config.get('PORT', { infer: true }) || 3000
  await app.listen(port, '0.0.0.0').then(async () => {
    console.log(`\n🚀 Application is running on: ${await app.getUrl()}`)
    console.log(`📃 API-Doc is running on: ${await app.getUrl()}/api`)
  })
}
bootstrap()

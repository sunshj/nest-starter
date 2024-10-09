import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino'
import { Level, stdTimeFunctions } from 'pino'
import { timeFormat } from '~/utils'
import { Environment, EnvironmentVariables } from '../env'

function devLogger(level: Level): Params['pinoHttp'] {
  return {
    level,
    transport: {
      target: 'pino-pretty',
      options: { sync: true, colorize: true }
    },
    redact: { paths: ['req', 'res'], remove: true }
  }
}

function prodLogger(level: Level): Params['pinoHttp'] {
  return {
    level,
    customProps() {
      return {
        context: 'Http'
      }
    },
    transport: {
      target: 'pino-roll',
      options: {
        file: join('logs', level),
        size: '10m',
        frequency: 'daily',
        mkdir: true,
        extension: `.${timeFormat(Date.now(), 'YYYY-MM-DD')}.log`
      }
    }
  }
}

export const loggerModuleAsyncParams: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory(configService: ConfigService<EnvironmentVariables>) {
    const level = configService.get('LOG_LEVEL', { infer: true })
    const isDev = configService.get('NODE_ENV', { infer: true }) === Environment.Development
    const levelLogger = isDev ? devLogger(level) : prodLogger(level)

    return {
      forRoutes: ['*'],
      pinoHttp: {
        quietReqLogger: true,
        genReqId: (req, res) => {
          const existingID = req.id ?? req.headers['x-request-id']
          if (existingID) return existingID
          const id = randomUUID()
          res.setHeader('X-Request-Id', id)
          return id
        },
        formatters: {
          level(label) {
            return { level: label.toUpperCase() }
          }
        },
        customLogLevel(_req, res, err) {
          if (res.statusCode >= 500 || err) return 'error'
          if (res.statusCode >= 400) return 'warn'
          return 'info'
        },
        customSuccessMessage(_req, res) {
          return `${res.statusCode} ${res.statusMessage}`
        },
        customErrorMessage(_req, _res, err) {
          return err.message.replaceAll('\n', '')
        },
        timestamp: stdTimeFunctions.isoTime,
        ...levelLogger
      }
    }
  }
}

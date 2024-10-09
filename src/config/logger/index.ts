import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Params } from 'nestjs-pino'
import { LoggerModuleAsyncParams } from 'nestjs-pino/params'
import { Level, stdTimeFunctions } from 'pino'
import { timeFormat } from '~/utils'
import { EnvironmentVariables } from '../env'

function levelLogger(level: Level, env: string): Params['pinoHttp'] {
  return env === 'production'
    ? {
        level,
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
    : {
        level,
        transport: {
          target: 'pino-pretty',
          options: { sync: true, colorize: true }
        },
        redact: { paths: ['req', 'res'], remove: true }
      }
}

export const loggerModuleAsyncParams: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory(configService: ConfigService<EnvironmentVariables>) {
    return {
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
        ...levelLogger(configService.get('LOG_LEVEL'), configService.get('NODE_ENV'))
      }
    }
  }
}

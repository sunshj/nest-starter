import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { Level, stdTimeFunctions } from 'pino'
import { Params } from 'nestjs-pino'
import { timeFormat } from '~/utils'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModuleAsyncParams } from 'nestjs-pino/params'
import { EnvironmentVariables } from '~/common/env'

const levelLogger = (level: Level): Params['pinoHttp'] =>
  process.env.NODE_ENV === 'production'
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

export const loggerOptions: LoggerModuleAsyncParams = {
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
        customSuccessMessage(req, res) {
          return res.statusMessage
        },
        timestamp: stdTimeFunctions.isoTime,
        ...levelLogger(configService.get('LOG_LEVEL') || 'info')
      }
    }
  }
}

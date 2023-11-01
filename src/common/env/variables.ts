import { IsEnum, IsOptional, IsPort, IsString, IsUrl } from 'class-validator'
import { LogLevel } from '~/common/env/enums'
import { Level } from 'pino'

export class EnvironmentVariables {
  @IsPort()
  @IsOptional()
  PORT?: string

  @IsUrl({
    protocols: ['mysql'],
    require_tld: false
  })
  DATABASE_URL: string

  @IsString()
  JWT_SECRET: string

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL?: Level
}

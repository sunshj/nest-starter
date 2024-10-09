import { IsEnum, IsOptional, IsPort, IsString, IsUrl } from 'class-validator'
import { Level } from 'pino'
import { Environment, LogLevel } from './enums'

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment = Environment.Development

  @IsPort()
  @IsOptional()
  PORT?: string

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL?: Level = LogLevel.info

  @IsUrl({
    protocols: ['mysql'],
    require_tld: false
  })
  DATABASE_URL: string

  @IsString()
  JWT_SECRET: string
}

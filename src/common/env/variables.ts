import { IsOptional, IsPort, IsString, IsUrl } from 'class-validator'

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
}

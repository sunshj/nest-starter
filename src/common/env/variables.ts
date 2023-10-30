import { IsOptional, IsPort, IsUrl } from 'class-validator'

export class EnvironmentVariables {
  @IsPort()
  @IsOptional()
  PORT?: string

  @IsUrl({
    protocols: ['mysql'],
    require_tld: false
  })
  DATABASE_URL: string
}

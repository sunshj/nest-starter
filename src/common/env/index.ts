import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { EnvironmentVariables } from './variables'
import { colors } from '~/utils'

export * from './variables'
export * from './enums'

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    const properties = errors.map(error => error.property)
    throw new Error(colors.red(`环境变量 ${properties} 验证失败，请检查.env文件配置。`))
  }
  return validatedConfig
}

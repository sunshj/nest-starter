import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime/library'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private logger: PinoLogger) {
    super({
      log: [
        {
          level: 'query',
          emit: 'event'
        },
        'error'
      ]
    })
    this.logger.setContext(PrismaService.name)
  }

  private getOriginalQuerySql(query: string, params: any[]) {
    return query.replaceAll('?', () =>
      typeof params[0] === 'string' ? `'${params.shift() as string}'` : params.shift()
    )
  }

  async onModuleInit() {
    await this.$connect().catch(() => {})
    this.$on('query', ({ query, params }) => {
      this.logger.info(this.getOriginalQuerySql(query, JSON.parse(params)))
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

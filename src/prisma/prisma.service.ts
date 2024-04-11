import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime/library'
import { colors } from 'consola/utils'

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        {
          level: 'query',
          emit: 'event'
        },
        'error'
      ]
    })
  }

  private getOriginalQuerySql(query: string, params: any[]) {
    return query.replace(/\?/g, () =>
      typeof params[0] === 'string' ? `'${params.shift() as string}'` : params.shift()
    )
  }

  async onModuleInit() {
    await this.$connect().catch(() => {})
    this.$on('query', ({ query, params }) => {
      console.log(colors.blue('prisma query'), this.getOriginalQuerySql(query, JSON.parse(params)))
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

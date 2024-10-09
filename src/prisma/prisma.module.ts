import { Global, Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService, LoggerModule],
  exports: [PrismaService]
})
export class PrismaModule {}

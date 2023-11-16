import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './common/decorators'
import { ApiOperation } from '@nestjs/swagger'

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '测试接口' })
  getHello() {
    return this.appService.getHello()
  }
}

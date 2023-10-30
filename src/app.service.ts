import { Injectable } from '@nestjs/common'
import { PrettyResult } from './utils'

@Injectable()
export class AppService {
  getHello() {
    // return 'Hello World!'
    /** or */
    return PrettyResult.success('Hello World!', { message: 'OK' })
  }
}

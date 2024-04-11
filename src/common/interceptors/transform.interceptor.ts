import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { PrettyResult } from '~/utils'

interface ResData<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResData<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ResData<T>> {
    return next.handle().pipe(
      map(data => ({
        ...(data.__pretty__ ? data : PrettyResult.success(data)),
        __pretty__: Symbol('will be deleted during serialization')
      }))
    )
  }
}

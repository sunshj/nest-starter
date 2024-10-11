import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

interface ExceptionResponseBody {
  statusCode: number
  message: any
  time: string
  path: string
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    const responseBody: ExceptionResponseBody = {
      statusCode: 500,
      message: 'Internal Server Error',
      time: new Date().toISOString(),
      path: req.originalUrl
    }

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus()
      const { message } = exception.getResponse() as { message: any }
      responseBody.message =
        (message && (Array.isArray(message) ? message : message.replaceAll('\n', ''))) ||
        exception.message.replaceAll('\n', '')
    }

    res.status(responseBody.statusCode).json(responseBody)
  }
}

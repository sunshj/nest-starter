import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { isNotEmptyObject } from 'class-validator'
import { Request, Response } from 'express'

interface ExceptionResponseBody {
  statusCode: number
  error: any
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
      error: isNotEmptyObject(exception) ? exception : exception.stack,
      message: 'Internal Server Error',
      time: new Date().toISOString(),
      path: req.originalUrl
    }

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus()
      const { message, error } = exception.getResponse() as { message: any; error: any }
      responseBody.message =
        (message && (Array.isArray(message) ? message : message.replaceAll('\n', ''))) ||
        exception.message.replaceAll('\n', '')
      responseBody.error = error
    }

    res.status(responseBody.statusCode).json(responseBody)
  }
}

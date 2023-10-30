import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
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
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const responseBody: ExceptionResponseBody = {
      statusCode: 500,
      error: exception,
      message: 'Internal Server Error',
      time: new Date().toISOString(),
      path: req.originalUrl
    }

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus()
      const { message, error } = exception.getResponse() as { message: any; error: any }
      responseBody.message =
        (message && (Array.isArray(message) ? message : message.replace(/\n/g, ''))) ||
        exception.message.replace(/\n/g, '')
      responseBody.error = error
    }

    res.status(responseBody.statusCode).json(responseBody)
  }
}

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const message = exception.meta.cause || exception.message

    res.status(500).json({
      statusCode: 500,
      message,
      time: new Date().toISOString(),
      path: req.originalUrl
    })
  }
}

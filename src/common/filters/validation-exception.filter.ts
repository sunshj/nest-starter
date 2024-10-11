import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const { message } = exception.getResponse() as { message: string[] }

    res.status(400).json({
      statusCode: 400,
      message: message.join(', '),
      time: new Date().toISOString(),
      path: req.originalUrl
    })
  }
}

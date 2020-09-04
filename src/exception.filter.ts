import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { HeadersAlreadyWrittenException } from './exception/headers-already-written.exception';

@Catch()
export class GeneralExceptionFilter<T> extends BaseExceptionFilter<T> implements ExceptionFilter<T> {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    console.log(exception);

    switch (exception) {
      case exception instanceof HeadersAlreadyWrittenException:
        break;
      default:
        const status = exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}

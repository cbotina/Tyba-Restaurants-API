import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    const code = (exception as any).code;

    switch (exception.constructor) {
      case AxiosError:
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = (exception as AxiosError).message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      code,
    });
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = request.header('x-correlation-id') ?? 'unknown';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const body: ErrorBody =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? {
              statusCode: status,
              message: (exceptionResponse as Partial<ErrorBody>).message ?? exception.message,
              error: (exceptionResponse as Partial<ErrorBody>).error ?? exception.name
            }
          : {
              statusCode: status,
              message: exception.message,
              error: exception.name
            };

      response.status(status).json({
        ...body,
        correlationId,
        path: request.url,
        timestamp: new Date().toISOString()
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected server error',
      error: 'InternalServerError',
      correlationId,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}

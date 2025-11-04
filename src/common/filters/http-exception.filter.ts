import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Catch all types of exceptions
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else {
        // 🟢 agar response ek object hai (like { message, error })
        message = (res as any).message || (res as any).error || 'Unexpected error';
      }
    } else {
      message = 'Internal server error';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message, // ab yeh hamesha string hogi ✅
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}

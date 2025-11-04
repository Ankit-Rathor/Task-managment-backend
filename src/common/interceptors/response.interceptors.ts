import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    console.log(`🚀 [${method}] ${url} → Request coming...`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(
          `✅ [${method}] ${url} → Request completed in ${duration}ms\n`,
        );
      }),
      map((data) => ({
        success: true,
        statusCode: 200,
        path: url,
        method,
        timestamp: new Date().toISOString(),
        data,
      })),
      catchError((error) => {
        const statusCode = error.status || 500;
        const message =
          error.response?.message || error.message || 'Internal server error';

        console.log(`❌ [${method}] ${url} → Failed (${statusCode})`);

        return throwError(() => ({
          success: false,
          statusCode,
          path: url,
          method,
          timestamp: new Date().toISOString(),
          message,
        }));
      }),
    );
  }
}

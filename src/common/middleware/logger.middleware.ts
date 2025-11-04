import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(`➡️ ${req.method} ${req.originalUrl} | Time: ${new Date().toLocaleTimeString()}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`✅ ${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
    });

    next(); // move to next handler (controller/service)
  }
}

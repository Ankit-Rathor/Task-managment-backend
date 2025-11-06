import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req['user'] = decoded;
        console.log(`✅ ${req.method} ${req.originalUrl} | Token verified`);
      } catch (err) {
        console.log('❌ Invalid token');
      }
    }
    next();
  }
}

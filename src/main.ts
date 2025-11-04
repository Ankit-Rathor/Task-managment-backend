// main.ts
import { ValidationPipe, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ CORS setup
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3003);
  console.log(`🚀 Backend running on http://localhost:3003`);
}
bootstrap();

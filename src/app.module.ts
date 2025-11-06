import { Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { TaskModule } from './task/task.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { JwtMiddleware } from './common/middleware/jwt.middleware';


@Module({
  imports: [UserModule, AuthModule, TaskModule], // ✅ AuthModule import karna enough hai
  controllers: [AppController],       // ✅ AuthController ko mat add karo
  providers: [AppService, PrismaService], // ✅ AuthService ko mat add karo
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware ,LoggerMiddleware)
      .forRoutes('*'); // ✅ Apply for all routes
  }
}

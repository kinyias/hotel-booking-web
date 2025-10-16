import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors({
    origin: [process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000'], // FE domain
    credentials: true, // Quan trọng để gửi cookie
  });
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Log để biết API đang chạy trên đâu
  console.log(`🚀 API is running on: http://localhost:${port}`);
}
bootstrap();

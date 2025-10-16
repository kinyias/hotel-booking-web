import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';

import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
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

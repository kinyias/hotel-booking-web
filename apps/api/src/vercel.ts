import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

let cachedApp: any = null;

async function createApp() {
  if (cachedApp) return cachedApp;

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
    origin: [process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  await app.init();

  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

// 👇 Export default cho Vercel
const handler = async (req: any, res: any) => {
  const app = await createApp();
  return app(req, res);
};

export default handler;

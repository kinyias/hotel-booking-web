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
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.setGlobalPrefix('api/v1');
  await app.init();

  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

const handler = async (req: any, res: any) => {
  const app = await createApp();
  return app(req, res);
};

// ✅ Tự động start server khi chạy dev (Node environment)
if (process.env.NODE_ENV !== 'production') {
  createApp().then(app => {
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => console.log(`🚀 Dev server running on http://localhost:${port}`));
  });
}

// Export default cho Vercel
export default handler;

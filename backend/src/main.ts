import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Active le CORS pour ton front
  app.enableCors({
    origin: 'http://localhost:5173', // Autorise ton front en dev
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

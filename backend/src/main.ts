import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Allow: localhost, vercel.app, or if no origin (native apps)
      if (!origin || allowedOrigins.includes(origin) || origin?.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        // Log but allow for debugging
        console.warn(`CORS request from: ${origin}`);
        callback(null, true);
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🎮 Impostor backend running on http://localhost:${port}`);
}

bootstrap();

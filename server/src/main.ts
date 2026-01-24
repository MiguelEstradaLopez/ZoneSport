import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS - Permisivo en desarrollo, restrictivo en producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  app.enableCors({
    origin: isDevelopment ? '*' : process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipes de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend corriendo en http://localhost:${port}`);
  console.log(`✅ CORS habilitado para: ${isDevelopment ? 'todos los orígenes (desarrollo)' : process.env.FRONTEND_URL}`);
  console.log(`✅ Entorno: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();

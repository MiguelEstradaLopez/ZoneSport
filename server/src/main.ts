import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS - Permisivo en desarrollo
  app.enableCors({
    origin: '*', // En desarrollo, permitir todos los orígenes
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

  await app.listen(3001, '0.0.0.0');
  console.log('✅ Backend corriendo en http://localhost:3001');
  console.log('✅ CORS habilitado para todos los orígenes (desarrollo)');
}
bootstrap();

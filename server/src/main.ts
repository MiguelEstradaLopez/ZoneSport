import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Configurar Swagger para documentación de API
  const config = new DocumentBuilder()
    .setTitle('ZoneSport API')
    .setDescription('API de plataforma de deportes en línea ZoneSport')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y login')
    .addTag('users', 'Gestión de usuarios')
    .addTag('sports', 'Gestión de deportes')
    .addTag('events', 'Gestión de eventos')
    .addTag('matches', 'Gestión de partidos')
    .addTag('news', 'Gestión de noticias')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend corriendo en http://localhost:${port}`);
  console.log(`✅ API Docs disponible en http://localhost:${port}/api/docs`);
  console.log(`✅ CORS habilitado para: ${isDevelopment ? 'todos los orígenes (desarrollo)' : process.env.FRONTEND_URL}`);
  console.log(`✅ Entorno: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();

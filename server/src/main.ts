import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  // Log environment configuration on startup
  logger.log('='.repeat(60));
  logger.log('🚀 ZONESPORT BACKEND - STARTING UP');
  logger.log('='.repeat(60));
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Port: ${process.env.PORT || 3001}`);

  // Debug database configuration (secure - no passwords shown)
  const dbUrl = process.env.DATABASE_URL;
  const dbHost = process.env.DATABASE_HOST || process.env.DB_HOST;
  const dbPassword = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD;
  const dbUser = process.env.DATABASE_USER || process.env.DB_USERNAME;
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (dbUrl) {
    logger.log('✅ DATABASE_URL is SET - Using Render connection string');
    const isLocalUrl = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    logger.log(`      SSL: ${isLocalUrl ? 'DISABLED (localhost detected)' : 'ENABLED (remote server - Render)'}`);
  } else {
    logger.log('❌ DATABASE_URL NOT SET - Falling back to individual DB_* / DATABASE_* variables');
    logger.log(`      Host: ${dbHost ? 'CONFIGURED ✓' : 'NOT SET (using localhost)'}`);
    logger.log(`      User: ${dbUser || 'postgres'}`);
    logger.log(`      Password: ${dbPassword ? 'SET ✓' : '❌ NOT SET - Connection will fail!'}`);
    logger.log(`      Database: ${process.env.DB_NAME || process.env.DATABASE_NAME || 'zonesport_db'}`);
    const sslStatus = nodeEnv === 'production' ? 'ENABLED (production mode)' : 'DISABLED (development mode)';
    logger.log(`      SSL: ${sslStatus}`);
  }

  logger.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`); logger.log('='.repeat(60));

  // Validación de credenciales de base de datos
  console.log('🔐 Credenciales de conexión detectadas:', {
    usuario: process.env.DB_USERNAME || process.env.DATABASE_USER || 'postgres',
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost:5432',
    baseDatos: process.env.DB_NAME || process.env.DATABASE_NAME || 'zonesport_db',
  });

  // Log adicional solicitado por el equipo para verificar lectura de .env
  console.log('Conectando con usuario:', process.env.DB_USERNAME || process.env.DATABASE_USER || 'postgres');

  const app = await NestFactory.create(AppModule);

  // Configurar CORS - Permisivo en desarrollo, restrictivo en producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  const corsOrigin = isDevelopment
    ? '*'
    : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    };

  app.enableCors({
    origin: corsOrigin,
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

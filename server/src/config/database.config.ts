import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Sport } from '../sports/sport.entity';
import { Event } from '../events/event.entity';
import { Match } from '../matches/match.entity';
import { Classification } from '../classifications/classification.entity';
import { News } from '../news/news.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';

// Migrations must be loaded from dist/migrations in production
const getMigrationsPath = (): string => {
    return process.env.NODE_ENV === 'production' ? 'dist/migrations' : 'src/migrations';
};

/**
 * Configuración centralizada de TypeORM
 * Acepta ConfigService como parámetro para inyección de dependencias
 * Asegura que todas las credenciales sean strings válidos
 */
export const getDatabaseConfig = (configService?: ConfigService): TypeOrmModuleOptions => {
    // Obtener variables desde ConfigService si está disponible, sino usar process.env
    const getEnv = (key: string, defaultValue?: string): string | undefined => {
        if (configService) {
            return configService.get<string>(key) || defaultValue;
        }
        return process.env[key] || defaultValue;
    };

    const databaseUrl = getEnv('DATABASE_URL');
    const databaseHost = getEnv('DATABASE_HOST', 'localhost');
    const databasePort = parseInt(getEnv('DATABASE_PORT', '5432'), 10);
    const databaseUser = getEnv('DATABASE_USER', 'postgres');
    const databasePassword = getEnv('DATABASE_PASSWORD') || '';
    const databaseName = getEnv('DATABASE_NAME', 'zonesport_db');
    const nodeEnv = getEnv('NODE_ENV', 'development');

    // Asegurar que password siempre sea string (crítico para TypeORM)
    const safePassword = String(databasePassword);

    const migrationsPath = getMigrationsPath();

    return {
        type: 'postgres',
        // Prefer DATABASE_URL when available (useful for Render/managed PG services)
        ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: databaseHost,
                port: databasePort,
                username: databaseUser,
                password: safePassword, // Garantizado como string
                database: databaseName,
            }),
        entities: [User, Sport, Event, Match, Classification, News, PasswordResetToken],
        migrations: [`${migrationsPath}/*.js`],
        synchronize: nodeEnv === 'development',
        autoLoadEntities: true,
        logging: nodeEnv === 'development',
        // SSL para producción (Render requiere conexiones seguras)
        ssl: nodeEnv === 'production' || !!databaseUrl ? { rejectUnauthorized: false } : false,
        // Pool de conexiones para producción
        ...(nodeEnv === 'production' && {
            extra: {
                max: parseInt(getEnv('DB_POOL_MAX', '10'), 10),
                min: parseInt(getEnv('DB_POOL_MIN', '2'), 10),
                idleTimeoutMillis: parseInt(getEnv('DB_POOL_IDLE_TIMEOUT', '30000'), 10),
            },
        }),
    };
};

import { ActivityType } from '../activity-types/activity-type.entity';
import { Tournament } from '../tournaments/tournament.entity';
import { Team } from '../teams/team.entity';
import { TeamMember } from '../teams/team-member.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
// import { Sport } from '../sports/sport.entity';
// import { Event } from '../events/event.entity';
import { Match } from '../matches/match.entity';
import { Classification } from '../classifications/classification.entity';
import { News } from '../news/news.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';

// Migrations must be loaded from dist/migrations in production
const getMigrationsPath = (): string => {
    return process.env.NODE_ENV === 'production' ? 'dist/migrations' : 'src/migrations';
};

/**
 * Determina dinámicamente si SSL debe estar habilitado
 * CRITICAL FOR RENDER:
 * - Si DATABASE_URL existe (Render), SSL DEBE estar habilitado { rejectUnauthorized: false }
 * - Si estamos en producción, SSL DEBE estar habilitado
 * - Solo desactiva SSL en desarrollo local con localhost/127.0.0.1
 */
const getSSLConfig = (databaseUrl?: string, nodeEnv?: string): boolean | { rejectUnauthorized: false } => {
    // DATABASE_URL always requires SSL (unless localhost)
    if (databaseUrl) {
        const isLocalUrl = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
        if (isLocalUrl) {
            return false; // Local development: no SSL needed
        }
        return { rejectUnauthorized: false }; // Render/Cloud: SSL required
    }

    // Production mode (fallback to host/port) always requires SSL
    if (nodeEnv === 'production') {
        return { rejectUnauthorized: false };
    }

    // Development without DATABASE_URL: no SSL
    return false;
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

    // Prefer DB_* variables (requested), fall back to DATABASE_* for compatibility
    // CRITICAL: DATABASE_URL has absolute priority (used by Render)
    const databaseUrl = getEnv('DATABASE_URL') || getEnv('DB_URL');
    const databaseHost = getEnv('DB_HOST') || getEnv('DATABASE_HOST') || 'localhost';
    const databasePort = parseInt(getEnv('DB_PORT') || getEnv('DATABASE_PORT') || '5432', 10);
    const databaseUser = getEnv('DB_USERNAME') || getEnv('DATABASE_USER') || 'postgres';
    const databasePassword = getEnv('DB_PASSWORD') || getEnv('DATABASE_PASSWORD') || '';
    const databaseName = getEnv('DB_NAME') || getEnv('DATABASE_NAME') || 'zonesport_db';
    const nodeEnv = getEnv('NODE_ENV', 'development');

    // Asegurar que password siempre sea string (crítico para TypeORM)
    const safePassword = String(databasePassword);

    const migrationsPath = getMigrationsPath();

    return {
        type: 'postgres',
        // CRITICAL: DATABASE_URL has absolute priority (Render uses this)
        // Falls back to individual connection parameters (DB_HOST, DB_PORT, etc.) for local dev
        ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: databaseHost,
                port: databasePort,
                username: databaseUser,
                password: safePassword, // Garantizado como string
                database: databaseName,
            }),
        entities: [
            User,
            ActivityType,
            Tournament,
            Team,
            TeamMember,
            Match,
            Classification,
            News,
            PasswordResetToken,
        ],
        migrations: [`${migrationsPath}/*.js`],
        synchronize: nodeEnv === 'development',
        autoLoadEntities: true,
        logging: nodeEnv === 'development',
        // CRITICAL: SSL is automatically configured based on environment
        // - Production + DATABASE_URL = SSL enabled (Render requirement)
        // - Development + localhost = SSL disabled
        ssl: getSSLConfig(databaseUrl, nodeEnv),
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

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Sport } from '../sports/sport.entity';
import { Event } from '../events/event.entity';
import { Match } from '../matches/match.entity';
import { Classification } from '../classifications/classification.entity';
import { News } from '../news/news.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';

// Migrations must be loaded from dist/migrations in production
const migrationsPath = process.env.NODE_ENV === 'production'
    ? 'dist/migrations'
    : 'src/migrations';

/**
 * Configuración centralizada de TypeORM
 * Uso: TypeOrmModule.forRoot(getDatabaseConfig())
 */
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
    type: 'postgres',
    // Prefer DATABASE_URL when available (useful for Render/managed PG services)
    ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            username: process.env.DATABASE_USER || 'postgres',
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME || 'zonesport_db',
        }),
    entities: [User, Sport, Event, Match, Classification, News, PasswordResetToken],
    migrations: [`${migrationsPath}/*.js`],
    synchronize: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    logging: process.env.NODE_ENV === 'development',
    // SSL para producción (Render requiere conexiones seguras)
    ssl: process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    // Pool de conexiones para producción
    ...(process.env.NODE_ENV === 'production' && {
        extra: {
            max: parseInt(process.env.DB_POOL_MAX || '10', 10),
            min: parseInt(process.env.DB_POOL_MIN || '2', 10),
            idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
        },
    }),
});

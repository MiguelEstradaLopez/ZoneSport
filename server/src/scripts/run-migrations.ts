import { DataSource } from 'typeorm';

async function runMigrations() {
    try {
        // Import compiled database config (at runtime this will resolve to dist/config/database.config.js)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getDatabaseConfig } = require('../../config/database.config');
        const config = getDatabaseConfig();

        const dataSourceOptions: any = {
            type: 'postgres',
            migrations: [__dirname + '/../../migrations/*.js'],
            // respect SSL and pool extras from config
            ssl: config.ssl,
            extra: config.extra || {},
        };

        if (config.url) {
            dataSourceOptions.url = config.url;
        } else {
            dataSourceOptions.host = config.host;
            dataSourceOptions.port = config.port;
            dataSourceOptions.username = config.username;
            dataSourceOptions.password = config.password;
            dataSourceOptions.database = config.database;
        }

        const ds = new DataSource(dataSourceOptions);
        console.log('Running database migrations...');
        await ds.initialize();
        const pending = await ds.runMigrations();
        console.log(`Migrations applied: ${pending.length}`);
        await ds.destroy();
        process.exit(0);
    } catch (err) {
        console.error('Migration runner failed:', err);
        process.exit(1);
    }
}

runMigrations();

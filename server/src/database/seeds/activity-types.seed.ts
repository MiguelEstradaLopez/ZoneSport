import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ActivityCategory, ActivityType } from '../../activity-types/activity-type.entity';

type ActivitySeedItem = {
    name: string;
    category: ActivityCategory;
};

const ACTIVITY_TYPES_TO_SEED: ActivitySeedItem[] = [
    { name: 'Fútbol', category: ActivityCategory.SPORT },
    { name: 'Baloncesto', category: ActivityCategory.SPORT },
    { name: 'Voleibol', category: ActivityCategory.SPORT },
    { name: 'Tenis', category: ActivityCategory.SPORT },
    { name: 'Natación', category: ActivityCategory.SPORT },
    { name: 'Ciclismo', category: ActivityCategory.SPORT },
    { name: 'Atletismo', category: ActivityCategory.SPORT },
    { name: 'Béisbol', category: ActivityCategory.SPORT },
    { name: 'Rugby', category: ActivityCategory.SPORT },
    { name: 'Boxeo', category: ActivityCategory.SPORT },
    { name: 'Artes Marciales', category: ActivityCategory.SPORT },
    { name: 'Pádel', category: ActivityCategory.SPORT },
    { name: 'Squash', category: ActivityCategory.SPORT },
    { name: 'Golf', category: ActivityCategory.SPORT },
    { name: 'Fútbol Americano', category: ActivityCategory.SPORT },
    { name: 'Hockey', category: ActivityCategory.SPORT },
    { name: 'Bádminton', category: ActivityCategory.SPORT },
    { name: 'Ping Pong', category: ActivityCategory.SPORT },
    { name: 'Escalada', category: ActivityCategory.SPORT },
    { name: 'CrossFit', category: ActivityCategory.SPORT },
    { name: 'E-Sports', category: ActivityCategory.ESPORT },
    { name: 'Ajedrez', category: ActivityCategory.BOARD_GAME },
    { name: 'Juegos de Mesa', category: ActivityCategory.BOARD_GAME },
    { name: 'Otro', category: ActivityCategory.OTHER },
];

export async function seedActivityTypesIfEmpty(dataSource: DataSource, logger: Logger) {
    const repo = dataSource.getRepository(ActivityType);
    const total = await repo.count();

    logger.log(`[SEED] Current activity types count: ${total}`);

    if (total > 0) {
        logger.log('[SEED] Activity types already exist, skipping seed');
        return;
    }

    logger.log('[SEED] Starting to seed activity types...');

    for (const activityType of ACTIVITY_TYPES_TO_SEED) {
        try {
            const exists = await repo.findOne({ where: { name: activityType.name } });
            if (!exists) {
                const saved = await repo.save(
                    repo.create({
                        name: activityType.name,
                        category: activityType.category,
                        isCustom: false,
                        scoringConfig: {
                            metrics: ['wins', 'draws', 'losses', 'points'],
                            pointsPerWin: 3,
                            pointsPerDraw: 1,
                            pointsPerLoss: 0,
                        },
                        description: `Actividad ${activityType.name}`,
                    }),
                );
                logger.log(`[SEED] ✓ Seeded: ${activityType.name} (ID: ${saved.id})`);
            } else {
                logger.debug(`[SEED] Already exists: ${activityType.name}`);
            }
        } catch (err: any) {
            logger.error(`[SEED] Failed to seed ${activityType.name}:`, err.message);
        }
    }

    logger.log('[SEED] Activity types seeding completed');
}
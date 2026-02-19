import { DataSource } from 'typeorm';
import { ActivityType, ActivityCategory } from './activity-type.entity';

export async function seedActivityTypes(dataSource: DataSource) {
    const repo = dataSource.getRepository(ActivityType);
    const types = [
        {
            name: 'Fútbol',
            category: ActivityCategory.SPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'draws', 'losses', 'points', 'goals_for', 'goals_against'],
                pointsPerWin: 3,
                pointsPerDraw: 1,
                pointsPerLoss: 0,
            },
            description: 'Deporte de equipo tradicional',
        },
        {
            name: 'Baloncesto',
            category: ActivityCategory.SPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'points', 'score_for', 'score_against'],
                pointsPerWin: 2,
                pointsPerLoss: 0,
            },
            description: 'Deporte de equipo',
        },
        {
            name: 'Tenis',
            category: ActivityCategory.SPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'sets_won', 'sets_lost'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Deporte individual',
        },
        {
            name: 'Voleibol',
            category: ActivityCategory.SPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'sets_won', 'sets_lost'],
                pointsPerWin: 2,
                pointsPerLoss: 0,
            },
            description: 'Deporte de equipo',
        },
        {
            name: 'Natación',
            category: ActivityCategory.SPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'time'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Deporte individual',
        },
        {
            name: 'Ajedrez',
            category: ActivityCategory.BOARD_GAME,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'draws', 'losses', 'points'],
                pointsPerWin: 1,
                pointsPerDraw: 0.5,
                pointsPerLoss: 0,
            },
            description: 'Juego de mesa',
        },
        {
            name: 'Dominó',
            category: ActivityCategory.BOARD_GAME,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'points'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Juego de mesa',
        },
        {
            name: 'League of Legends',
            category: ActivityCategory.ESPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'points'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Esport',
        },
        {
            name: 'eFootball',
            category: ActivityCategory.ESPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'draws', 'losses', 'points'],
                pointsPerWin: 3,
                pointsPerDraw: 1,
                pointsPerLoss: 0,
            },
            description: 'Esport',
        },
        {
            name: 'Valorant',
            category: ActivityCategory.ESPORT,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'rounds_won', 'rounds_lost'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Esport',
        },
        {
            name: 'Rol competitivo',
            category: ActivityCategory.TABLETOP_RPG,
            isCustom: false,
            scoringConfig: {
                metrics: ['wins', 'losses', 'points'],
                pointsPerWin: 1,
                pointsPerLoss: 0,
            },
            description: 'Juego de rol competitivo',
        },
    ];

    for (const t of types) {
        const exists = await repo.findOne({ where: { name: t.name } });
        if (!exists) {
            await repo.save(repo.create(t));
        }
    }
}

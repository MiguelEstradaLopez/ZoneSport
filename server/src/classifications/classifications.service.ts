import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from './classification.entity';
import { Match } from '../matches/match.entity';

@Injectable()
export class ClassificationsService {
    constructor(
        @InjectRepository(Classification)
        private classificationsRepository: Repository<Classification>,
    ) { }

    async findByTournament(tournamentId: string): Promise<Classification[]> {
        const classifications = await this.classificationsRepository.find({
            where: { tournament: { id: tournamentId } },
            order: { position: 'ASC' },
            relations: ['tournament', 'team'],
        });
        return classifications;
    }

    // TODO: Reescribir la lógica de actualización de clasificaciones para el nuevo modelo.
    // Debe leer los datos de Match.result (JSONB) y actualizar Classification.customStats, points, wins, draws, losses, etc. según el scoringConfig del torneo.
    // La lógica anterior dependía de scoreA, scoreB, teamName, goalsFor, goalsAgainst, que ya no existen.

    // Métodos antiguos eliminados. Implementar lógica nueva aquí.

    async create(tournamentId: string, teamId: string): Promise<Classification> {
        const classification = this.classificationsRepository.create({
            tournament: { id: tournamentId },
            team: { id: teamId },
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            position: 0,
            played: 0,
            customStats: {},
        });
        return this.classificationsRepository.save(classification);
    }

    async remove(id: string): Promise<void> {
        const classification = await this.classificationsRepository.findOne({
            where: { id },
        });
        if (!classification) {
            throw new NotFoundException(`Classification with id ${id} not found`);
        }
        await this.classificationsRepository.remove(classification);
    }
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from './match.entity';
import { CreateMatchDto } from './dtos/create-match.dto';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>,
    ) { }

    async create(createMatchDto: CreateMatchDto): Promise<Match> {
        const match = this.matchesRepository.create({
            ...createMatchDto,
            scheduledAt: new Date(createMatchDto.scheduledAt),
        });
        return this.matchesRepository.save(match);
    }

    async findAll(): Promise<Match[]> {
        return this.matchesRepository.find({ relations: ['tournament', 'homeTeam', 'awayTeam'] });
    }

    async findOne(id: string): Promise<Match> {
        const match = await this.matchesRepository.findOne({
            where: { id },
            relations: ['tournament', 'homeTeam', 'awayTeam'],
        });
        if (!match) {
            throw new NotFoundException(`Match with id ${id} not found`);
        }
        return match;
    }

    async findByTournament(tournamentId: string): Promise<Match[]> {
        return this.matchesRepository.find({
            where: { tournament: { id: tournamentId } },
            relations: ['tournament', 'homeTeam', 'awayTeam'],
        });
    }

    async update(id: string, createMatchDto: CreateMatchDto): Promise<Match> {
        const match = await this.findOne(id);
        Object.assign(match, {
            ...createMatchDto,
            scheduledAt: new Date(createMatchDto.scheduledAt),
        });
        return this.matchesRepository.save(match);
    }

    // TODO: Adaptar recordResult para usar el campo result (JSONB) y el nuevo enum MatchStatus (no existe PLAYED, usar FINISHED)
    async recordResult(id: string, result: any): Promise<Match> {
        const match = await this.findOne(id);
        match.result = result;
        match.status = MatchStatus.FINISHED;
        return this.matchesRepository.save(match);
    }

    async remove(id: string): Promise<void> {
        const match = await this.findOne(id);
        await this.matchesRepository.remove(match);
    }
}

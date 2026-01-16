import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from './match.entity';
import { CreateMatchDto } from './dtos/create-match.dto';
import { RecordResultDto } from './dtos/record-result.dto';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>,
    ) { }

    async create(createMatchDto: CreateMatchDto): Promise<Match> {
        const match = this.matchesRepository.create({
            ...createMatchDto,
            scheduledDate: new Date(createMatchDto.scheduledDate),
        });
        return this.matchesRepository.save(match);
    }

    async findAll(): Promise<Match[]> {
        return this.matchesRepository.find({ relations: ['event'] });
    }

    async findOne(id: number): Promise<Match> {
        const match = await this.matchesRepository.findOne({
            where: { id },
            relations: ['event'],
        });
        if (!match) {
            throw new NotFoundException(`Match with id ${id} not found`);
        }
        return match;
    }

    async findByEvent(eventId: number): Promise<Match[]> {
        return this.matchesRepository.find({
            where: { eventId },
            relations: ['event'],
        });
    }

    async update(id: number, createMatchDto: CreateMatchDto): Promise<Match> {
        const match = await this.findOne(id);
        Object.assign(match, {
            ...createMatchDto,
            scheduledDate: new Date(createMatchDto.scheduledDate),
        });
        return this.matchesRepository.save(match);
    }

    async recordResult(id: number, recordResultDto: RecordResultDto): Promise<Match> {
        const match = await this.findOne(id);
        match.scoreA = recordResultDto.scoreA;
        match.scoreB = recordResultDto.scoreB;
        match.status = MatchStatus.PLAYED;
        return this.matchesRepository.save(match);
    }

    async remove(id: number): Promise<void> {
        const match = await this.findOne(id);
        await this.matchesRepository.remove(match);
    }
}

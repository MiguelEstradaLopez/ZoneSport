import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './sport.entity';
import { CreateSportDto } from './dtos/create-sport.dto';

@Injectable()
export class SportsService {
    constructor(
        @InjectRepository(Sport)
        private sportsRepository: Repository<Sport>,
    ) { }

    async create(createSportDto: CreateSportDto): Promise<Sport> {
        const sport = this.sportsRepository.create({
            ...createSportDto,
            classificationRules: createSportDto.classificationRules || {
                pointsForWin: 3,
                pointsForDraw: 1,
                pointsForLoss: 0,
            },
        });
        return this.sportsRepository.save(sport);
    }

    async findAll(): Promise<Sport[]> {
        return this.sportsRepository.find();
    }

    async findOne(id: number): Promise<Sport | null> {
        return this.sportsRepository.findOne({ where: { id } });
    }

    async update(id: number, createSportDto: CreateSportDto): Promise<Sport> {
        await this.sportsRepository.update(id, createSportDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.sportsRepository.delete(id);
    }
}

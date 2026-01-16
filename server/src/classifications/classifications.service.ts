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

    async findByEvent(eventId: number): Promise<Classification[]> {
        const classifications = await this.classificationsRepository.find({
            where: { eventId },
            order: { position: 'ASC' },
            relations: ['event'],
        });
        return classifications;
    }

    async updateClassifications(eventId: number, matches: Match[]): Promise<void> {
        const classifications = await this.classificationsRepository.find({
            where: { eventId },
        });

        const classificationMap = new Map(
            classifications.map((c) => [c.teamName, c]),
        );

        // Reset counts
        classificationMap.forEach((c) => {
            c.points = 0;
            c.wins = 0;
            c.draws = 0;
            c.losses = 0;
            c.goalsFor = 0;
            c.goalsAgainst = 0;
        });

        // Process matches
        matches.forEach((match) => {
            if (match.scoreA !== null && match.scoreB !== null) {
                const teamA = classificationMap.get(match.teamA);
                const teamB = classificationMap.get(match.teamB);

                if (teamA) {
                    teamA.goalsFor += match.scoreA;
                    teamA.goalsAgainst += match.scoreB;

                    if (match.scoreA > match.scoreB) {
                        teamA.wins += 1;
                        teamA.points += 3;
                    } else if (match.scoreA === match.scoreB) {
                        teamA.draws += 1;
                        teamA.points += 1;
                    } else {
                        teamA.losses += 1;
                    }
                }

                if (teamB) {
                    teamB.goalsFor += match.scoreB;
                    teamB.goalsAgainst += match.scoreA;

                    if (match.scoreB > match.scoreA) {
                        teamB.wins += 1;
                        teamB.points += 3;
                    } else if (match.scoreB === match.scoreA) {
                        teamB.draws += 1;
                        teamB.points += 1;
                    } else {
                        teamB.losses += 1;
                    }
                }
            }
        });

        // Sort by points and goals difference
        const sorted = Array.from(classificationMap.values()).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const aDiff = a.goalsFor - a.goalsAgainst;
            const bDiff = b.goalsFor - b.goalsAgainst;
            return bDiff - aDiff;
        });

        // Assign positions
        sorted.forEach((c, index) => {
            c.position = index + 1;
        });

        await this.classificationsRepository.save(sorted);
    }

    async create(eventId: number, teamName: string): Promise<Classification> {
        const classification = this.classificationsRepository.create({
            eventId,
            teamName,
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            position: 0,
        });
        return this.classificationsRepository.save(classification);
    }

    async remove(id: number): Promise<void> {
        const classification = await this.classificationsRepository.findOne({
            where: { id },
        });
        if (!classification) {
            throw new NotFoundException(`Classification with id ${id} not found`);
        }
        await this.classificationsRepository.remove(classification);
    }
}

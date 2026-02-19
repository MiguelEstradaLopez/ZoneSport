import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { User } from '../users/user.entity';
import { TournamentFormat, TournamentStatus } from './tournament.entity';

@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private readonly tournamentRepo: Repository<Tournament>,
    ) { }

    async findAll(query: any) {
        // TODO: Filtros por activityTypeId, format, status, isPublic, hasSpace, lat/lng/radius
        return this.tournamentRepo.find();
    }

    async findOne(id: string) {
        const tournament = await this.tournamentRepo.findOne({ where: { id } });
        if (!tournament) throw new NotFoundException('Tournament not found');
        return tournament;
    }

    async create(dto: CreateTournamentDto, user: User) {
        const tournament = this.tournamentRepo.create({ ...dto, organizer: user });
        return this.tournamentRepo.save(tournament);
    }

    async update(id: string, dto: UpdateTournamentDto, user: User) {
        const tournament = await this.findOne(id);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }
        Object.assign(tournament, dto);
        return this.tournamentRepo.save(tournament);
    }

    async remove(id: string, user: User) {
        const tournament = await this.findOne(id);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }
        await this.tournamentRepo.remove(tournament);
        return { deleted: true };
    }

    async join(id: string, user: User) {
        // TODO: Lógica para unirse a torneo
        return { joined: true };
    }

    async getClassification(id: string) {
        // TODO: Lógica para tabla de clasificación
        return [];
    }
}

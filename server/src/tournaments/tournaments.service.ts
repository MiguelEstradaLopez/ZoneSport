import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { User } from '../users/user.entity';
import { TournamentFormat, TournamentStatus } from './tournament.entity';
import { Team } from '../teams/team.entity';
import { Match, MatchStatus } from '../matches/match.entity';

@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(Tournament)
        private readonly tournamentRepo: Repository<Tournament>,
        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,
        @InjectRepository(Match)
        private readonly matchRepo: Repository<Match>,
    ) { }

    async findAll(query: any) {
        // TODO: Filtros por activityTypeId, format, status, isPublic, hasSpace, lat/lng/radius
        return this.tournamentRepo.find();
    }

    async findOne(id: string) {
        const tournament = await this.tournamentRepo.findOne({
            where: { id },
            relations: ['organizer', 'activityType'],
        });
        if (!tournament) throw new NotFoundException('Tournament not found');
        return tournament;
    }

    async create(dto: CreateTournamentDto, user: User) {
        if (dto.startDate) dto.startDate = new Date(dto.startDate);
        if (dto.endDate) dto.endDate = new Date(dto.endDate);
        if (dto.registrationDeadline) dto.registrationDeadline = new Date(dto.registrationDeadline);

        // Generar join code aleatorio
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const tournament = this.tournamentRepo.create({ ...dto, organizer: user, joinCode });
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

    // --- Teams ---
    async getTeams(tournamentId: string) {
        return this.teamRepo.find({ where: { tournamentId } });
    }

    async addTeam(tournamentId: string, name: string, user: User) {
        const tournament = await this.findOne(tournamentId);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }

        const currentCount = await this.teamRepo.count({ where: { tournamentId } });
        if (currentCount >= tournament.maxTeams) {
            throw new Error('Tournament is full');
        }

        const team = this.teamRepo.create({ name, tournamentId, tournament });
        return this.teamRepo.save(team);
    }

    async removeTeam(tournamentId: string, teamId: string, user: User) {
        const tournament = await this.findOne(tournamentId);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }
        await this.teamRepo.delete({ id: teamId, tournamentId });
        return { deleted: true };
    }

    // --- Matches ---
    async getMatches(tournamentId: string) {
        // We use tournamentId relation condition to find matches since we didn't add tournamentId pure column to Match.
        return this.matchRepo.find({
            where: { tournament: { id: tournamentId } },
            order: { round: 'ASC', scheduledDate: 'ASC' }
        });
    }

    async createMatch(tournamentId: string, data: any, user: User) {
        const tournament = await this.findOne(tournamentId);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }
        const match = this.matchRepo.create({
            ...data,
            tournament,
            status: MatchStatus.SCHEDULED,
            result: {}
        });
        return this.matchRepo.save(match);
    }

    async createMatchesBulk(tournamentId: string, matchesData: any[], user: User) {
        const tournament = await this.findOne(tournamentId);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }

        const createdMatches = [];
        for (const data of matchesData) {
            const match = this.matchRepo.create({
                ...data,
                tournament,
                status: MatchStatus.SCHEDULED,
                result: {}
            });
            createdMatches.push(await this.matchRepo.save(match));
        }
        return createdMatches;
    }

    async updateMatch(tournamentId: string, matchId: string, data: any, user: User) {
        const tournament = await this.findOne(tournamentId);
        if (tournament.organizer.id !== user.id && user.role !== 'ADMIN') {
            throw new ForbiddenException('No permission');
        }

        const match = await this.matchRepo.findOne({ where: { id: matchId, tournament: { id: tournamentId } } });
        if (!match) throw new NotFoundException('Match not found');

        Object.assign(match, data);
        if (data.matchStatus === 'FINISHED') {
            match.status = MatchStatus.FINISHED;
        }

        return this.matchRepo.save(match);
    }
}

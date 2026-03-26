import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { TournamentService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('tournaments')
export class TournamentsController {
    constructor(private readonly tournamentService: TournamentService) { }

    @Get()
    getAll(@Query() query: any) {
        return this.tournamentService.findAll(query);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.tournamentService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
                exceptionFactory: (errors) => {
                    const messages = errors.map(e =>
                        Object.values(e.constraints || {}).join(', ')
                    ).join(' | ');
                    console.log('[TOURNAMENT CREATE] Errores:', messages);
                    return new BadRequestException(messages);
                },
            }),
        )
        dto: CreateTournamentDto,
        @Request() req,
    ) {
        console.log('[TOURNAMENT CREATE] Body recibido OK');
        return this.tournamentService.create(dto, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdateTournamentDto, @Request() req) {
        return this.tournamentService.update(id, dto, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Request() req) {
        console.log('[DELETE] user del JWT:', JSON.stringify(req.user));
        console.log('[DELETE] tournament id:', id);
        return this.tournamentService.remove(id, req.user);
    }

    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    join(@Param('id') id: string, @Request() req) {
        return this.tournamentService.join(id, req.user);
    }

    @Get(':id/classification')
    getClassification(@Param('id') id: string) {
        return this.tournamentService.getClassification(id);
    }

    // --- Equipos ---
    @Get(':id/teams')
    getTeams(@Param('id') id: string) {
        return this.tournamentService.getTeams(id);
    }

    @Post(':id/teams')
    @UseGuards(JwtAuthGuard)
    addTeam(@Param('id') id: string, @Body() body: { name: string }, @Request() req) {
        return this.tournamentService.addTeam(id, body.name, req.user);
    }

    @Delete(':id/teams/:teamId')
    @UseGuards(JwtAuthGuard)
    removeTeam(@Param('id') id: string, @Param('teamId') teamId: string, @Request() req) {
        return this.tournamentService.removeTeam(id, teamId, req.user);
    }

    @Get(':id/teams/:teamId/members')
    getTeamMembers(@Param('id') id: string, @Param('teamId') teamId: string) {
        return this.tournamentService.getTeamMembers(id, teamId);
    }

    @Post(':id/teams/:teamId/join')
    @UseGuards(JwtAuthGuard)
    joinTeam(@Param('id') id: string, @Param('teamId') teamId: string, @Request() req) {
        return this.tournamentService.joinTeam(id, teamId, req.user);
    }

    @Delete(':id/teams/:teamId/leave')
    @UseGuards(JwtAuthGuard)
    leaveTeam(@Param('id') id: string, @Param('teamId') teamId: string, @Request() req) {
        return this.tournamentService.leaveTeam(id, teamId, req.user);
    }

    // --- Partidos ---
    @Get(':id/matches')
    getMatches(@Param('id') id: string) {
        return this.tournamentService.getMatches(id);
    }

    @Post(':id/matches')
    @UseGuards(JwtAuthGuard)
    createMatch(
        @Param('id') id: string,
        @Body() body: { team1Id?: string; team2Id?: string; scheduledDate?: string; round?: number } | any[],
        @Request() req
    ) {
        // Soporta crear 1 partido o un array de partidos (para generación automática)
        if (Array.isArray(body)) {
             return this.tournamentService.createMatchesBulk(id, body, req.user);
        }
        return this.tournamentService.createMatch(id, body, req.user);
    }

    @Patch(':id/matches/:matchId')
    @UseGuards(JwtAuthGuard)
    updateMatch(
        @Param('id') id: string,
        @Param('matchId') matchId: string,
        @Body() body: { team1Score?: number; team2Score?: number; matchStatus?: string },
        @Request() req
    ) {
        return this.tournamentService.updateMatch(id, matchId, body, req.user);
    }
}

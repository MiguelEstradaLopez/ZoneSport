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
                exceptionFactory: (errors) => {
                    console.log('[TOURNAMENT CREATE] Errores de validación:', JSON.stringify(errors));
                    return new BadRequestException(errors);
                },
            }),
        )
        dto: CreateTournamentDto,
        @Request() req,
    ) {
        console.log('[TOURNAMENT CREATE] Body recibido:', JSON.stringify(dto));
        return this.tournamentService.create(dto, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateTournamentDto, @Request() req) {
        return this.tournamentService.update(id, dto, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
    remove(@Param('id') id: string, @Request() req) {
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
}

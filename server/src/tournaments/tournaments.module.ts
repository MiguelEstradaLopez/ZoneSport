import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './tournament.entity';
import { TournamentsController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';
import { Team } from '../teams/team.entity';
import { Match } from '../matches/match.entity';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tournament, Team, Match, User])],
    controllers: [TournamentsController],
    providers: [TournamentService],
    exports: [TypeOrmModule],
})
export class TournamentsModule { }

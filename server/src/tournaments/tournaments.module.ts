import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './tournament.entity';
import { TournamentsController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tournament])],
    controllers: [TournamentsController],
    providers: [TournamentService],
    exports: [TypeOrmModule],
})
export class TournamentsModule { }

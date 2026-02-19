import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamMember } from './team-member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Team, TeamMember])],
    exports: [TypeOrmModule],
})
export class TeamsModule { }

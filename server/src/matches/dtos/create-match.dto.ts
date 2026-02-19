import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { MatchStatus } from '../match.entity';

export class CreateMatchDto {
    @IsString()
    teamA: string;

    @IsString()
    teamB: string;

    @IsDateString()
    scheduledAt: string;

    @IsNumber()
    eventId: number;

    @IsOptional()
    @IsNumber()
    scoreA?: number;

    @IsOptional()
    @IsNumber()
    scoreB?: number;

    @IsOptional()
    @IsEnum(MatchStatus)
    status?: MatchStatus;
}

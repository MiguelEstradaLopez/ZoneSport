import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RecordResultDto {
    @IsString()
    teamName: string;

    @IsNumber()
    scoreA: number;

    @IsNumber()
    scoreB: number;

    @IsOptional()
    @IsNumber()
    matchId?: number;
}

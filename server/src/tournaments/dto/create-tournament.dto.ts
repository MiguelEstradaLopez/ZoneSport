import { IsString, IsEnum, IsInt, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { TournamentFormat, TournamentStatus } from '../tournament.entity';

export class CreateTournamentDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    activityTypeId: string;

    @IsEnum(TournamentFormat)
    format: TournamentFormat;

    @IsEnum(TournamentStatus)
    status: TournamentStatus;

    @IsInt()
    maxTeams: number;

    @IsOptional()
    @Transform(({ value }) => value)
    startDate?: any;

    @IsOptional()
    @Transform(({ value }) => value)
    endDate?: any;

    @IsOptional()
    customScoringConfig?: any;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @IsString()
    @IsOptional()
    locationName?: string;

    @IsString()
    @IsOptional()
    locationAddress?: string;

    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    latitude?: any;

    @IsOptional()
    @Transform(({ value }) => value ? Number(value) : undefined)
    longitude?: any;

    @IsOptional()
    @Transform(({ value }) => value)
    registrationDeadline?: any;
}

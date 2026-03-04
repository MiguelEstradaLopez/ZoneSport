import { IsString, IsEnum, IsDateString, IsInt, IsBoolean, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
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

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

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
    @IsNumber({ maxDecimalPlaces: 8 })
    @Type(() => Number)
    latitude?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 8 })
    @Type(() => Number)
    longitude?: number;

    @IsDateString()
    @IsOptional()
    registrationDeadline?: Date;
}

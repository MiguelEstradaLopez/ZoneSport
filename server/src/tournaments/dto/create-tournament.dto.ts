import { IsString, IsEnum, IsDateString, IsInt, IsBoolean, IsOptional, IsNumber, IsUUID } from 'class-validator';
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

    @IsNumber({ maxDecimalPlaces: 8 })
    @IsOptional()
    latitude?: number;

    @IsNumber({ maxDecimalPlaces: 8 })
    @IsOptional()
    longitude?: number;

    @IsDateString()
    @IsOptional()
    registrationDeadline?: Date;
}

import { IsString, MinLength, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsNumber()
    sportId: number;

    @IsNumber()
    organizerId: number;
}

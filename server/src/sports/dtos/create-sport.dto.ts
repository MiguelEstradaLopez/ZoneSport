import { IsString, MinLength, IsOptional, IsObject } from 'class-validator';

export class CreateSportDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    classificationRules?: {
        pointsForWin: number;
        pointsForDraw: number;
        pointsForLoss: number;
    };
}

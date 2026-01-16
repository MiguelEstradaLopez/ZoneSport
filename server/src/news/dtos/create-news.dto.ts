import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class CreateNewsDto {
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    title: string;

    @IsString()
    @MinLength(10)
    content: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    summary?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}

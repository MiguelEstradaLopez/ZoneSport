import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s).+$/, {
        message: 'La contraseña debe incluir mayúsculas, minúsculas, números y al menos un espacio',
    })
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;


    @IsOptional()
    role?: UserRole;
}

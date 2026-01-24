import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserRole } from '../users/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private emailService: EmailService,
        private jwtService: JwtService,
        @InjectRepository(PasswordResetToken)
        private passwordResetTokenRepository: Repository<PasswordResetToken>,
    ) { }

    async validateUser(email: string, password: string) {
        try {
            const user = await this.usersService.findByEmail(email);
            console.log(`[AUTH] validateUser - User found: ${email ? 'YES' : 'NO'}`);

            if (!user) {
                console.log(`[AUTH] validateUser - User not found for email: ${email}`);
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(`[AUTH] validateUser - Password valid: ${isPasswordValid ? 'YES' : 'NO'}`);
            console.log(`[AUTH] validateUser - Password from DB exists: ${user.password ? 'YES' : 'NO'}`);

            if (isPasswordValid) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            console.error(`[AUTH] validateUser - Error comparing passwords:`, error);
            return null;
        }
    }

    async login(loginDto: LoginDto) {
        console.log(`[AUTH] login - Attempting login for: ${loginDto.email}`);
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            console.log(`[AUTH] login - Validation failed for: ${loginDto.email}`);
            throw new UnauthorizedException('Email o contraseña inválida');
        }

        console.log(`[AUTH] login - Validation successful for: ${loginDto.email}`);
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '24h' as any,
            }),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        // Verificar si el email ya existe
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Verificar que el email es válido haciendo un test simple
        // En un entorno real, aquí enviarías un email de confirmación
        if (!this.isValidEmail(registerDto.email)) {
            throw new BadRequestException('El email no tiene un formato válido');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        console.log(`[AUTH] register - Password hashed for: ${registerDto.email}`);

        // Crear el usuario como ATHLETE por defecto
        const user = await this.usersService.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phone: registerDto.phone,
            role: UserRole.ATHLETE, // Todos los nuevos usuarios son ATHLETE
        });

        console.log(`[AUTH] register - User created successfully: ${registerDto.email}`);

        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '24h' as any,
            }),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        const { email } = forgotPasswordDto;
        console.log(`[AUTH] forgotPassword - Processing for: ${email}`);

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Por seguridad, no revelamos si el email existe o no
            console.log(`[AUTH] forgotPassword - User not found for: ${email}`);
            return { message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación' };
        }

        try {
            // Generar token de reset con expiración de 1 hora
            const resetToken = this.jwtService.sign(
                { email: user.email, sub: user.id, type: 'reset' },
                {
                    secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
                    expiresIn: '1h',
                },
            );

            // Guardar el token en la base de datos
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            await this.passwordResetTokenRepository.save({
                userId: user.id,
                user,
                token: resetToken,
                expiresAt,
            });

            console.log(`[AUTH] forgotPassword - Reset token saved for: ${email}`);

            // Enviar email con el enlace de reset
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
            await this.emailService.sendPasswordResetEmail(user.email, user.firstName, resetLink);

            console.log(`[AUTH] forgotPassword - Email sent successfully for: ${email}`);
            return { message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación' };
        } catch (error) {
            const err = error as Error;
            console.error(`[AUTH] forgotPassword - Error for ${email}:`, err.message);
            throw error;
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const { token, newPassword } = resetPasswordDto;

        // Verificar que el token existe en la BD
        const resetTokenRecord = await this.passwordResetTokenRepository.findOne({
            where: { token },
            relations: ['user'],
        });

        if (!resetTokenRecord) {
            throw new BadRequestException('El enlace de recuperación no es válido');
        }

        // Verificar que el token no ha expirado
        if (new Date() > resetTokenRecord.expiresAt) {
            await this.passwordResetTokenRepository.remove(resetTokenRecord);
            throw new BadRequestException('El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.');
        }

        // Validar el JWT del token
        try {
            this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
            });
        } catch (error) {
            throw new BadRequestException('El enlace de recuperación no es válido o ha expirado');
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await this.usersService.updatePassword(resetTokenRecord.user.id, hashedPassword);

        // Eliminar el token usado
        await this.passwordResetTokenRepository.remove(resetTokenRecord);

        return { message: 'Tu contraseña ha sido actualizada exitosamente' };
    }

    async validateResetToken(token: string): Promise<{ email: string; firstName: string }> {
        // Verificar que el token existe en la BD
        const resetTokenRecord = await this.passwordResetTokenRepository.findOne({
            where: { token },
            relations: ['user'],
        });

        if (!resetTokenRecord) {
            throw new BadRequestException('El enlace de recuperación no es válido');
        }

        // Verificar que el token no ha expirado
        if (new Date() > resetTokenRecord.expiresAt) {
            await this.passwordResetTokenRepository.remove(resetTokenRecord);
            throw new BadRequestException('El enlace de recuperación ha expirado');
        }

        // Validar el JWT del token
        try {
            this.jwtService.verify(token, {
                secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
            });
        } catch (error) {
            throw new BadRequestException('El enlace de recuperación no es válido o ha expirado');
        }

        return {
            email: resetTokenRecord.user.email,
            firstName: resetTokenRecord.user.firstName,
        };
    }
}
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password.trim(), user.passwordHash);
    if (isPasswordValid) {
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
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
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    if (!this.isValidEmail(registerDto.email)) {
      throw new BadRequestException('El email no tiene un formato válido');
    }
    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: UserRole.ATHLETE,
    });
    if (process.env.RESEND_API_KEY) {
      try {
        await this.emailService.sendWelcomeEmail(user.email, user.firstName || '');
      } catch {
        // Email es opcional, no fallar si no funciona
      }
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h',
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return {
        message:
          'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
      };
    }
    const resetToken = this.jwtService.sign(
      { userId: user.id },
      {
        secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await this.passwordResetTokenRepository.save({
      userId: user.id,
      user,
      token: resetToken,
      expiresAt,
    });
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      resetLink,
    );
    return {
      message:
        'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;
    const resetTokenRecord = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!resetTokenRecord) {
      throw new BadRequestException('El enlace de recuperación no es válido');
    }
    if (new Date() > resetTokenRecord.expiresAt) {
      await this.passwordResetTokenRepository.remove(resetTokenRecord);
      throw new BadRequestException(
        'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.',
      );
    }
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new BadRequestException(
        'El enlace de recuperación no es válido o ha expirado',
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(
      resetTokenRecord.user.id,
      hashedPassword,
    );
    await this.passwordResetTokenRepository.remove(resetTokenRecord);
    return { message: 'Tu contraseña ha sido actualizada exitosamente' };
  }

  async validateResetToken(
    token: string,
  ): Promise<{ email: string; firstName: string }> {
    const resetTokenRecord = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!resetTokenRecord) {
      throw new BadRequestException('El enlace de recuperación no es válido');
    }
    if (new Date() > resetTokenRecord.expiresAt) {
      await this.passwordResetTokenRepository.remove(resetTokenRecord);
      throw new BadRequestException(
        'El enlace de recuperación ha expirado',
      );
    }
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET,
      });
    } catch {
      throw new BadRequestException(
        'El enlace de recuperación no es válido o ha expirado',
      );
    }
    return {
      email: resetTokenRecord.user.email,
      firstName: resetTokenRecord.user.firstName,
    };
  }
}
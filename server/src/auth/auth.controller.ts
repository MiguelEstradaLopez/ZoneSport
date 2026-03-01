import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión iniciada correctamente' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getMe(@CurrentUser() user: User) {
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar reset de contraseña' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resetear contraseña con token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('validate-reset-token/:token')
  @ApiOperation({ summary: 'Validar token de reset de contraseña' })
  async validateResetToken(@Param('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar correo electrónico con código' })
  @ApiResponse({ status: 200, description: 'Correo verificado exitosamente' })
  async verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmailCode(body.email, body.code);
  }

  @Get('test-email')
  async testEmail() {
    await this.authService.testEmail();
    return { message: 'Email enviado' };
  }

  @Get('test-smtp-connection')
  async testSmtpConnection() {
    return new Promise((resolve) => {
      const net = require('net');
      const results: any = {};
      let pending = 3;
      
      const check = (port: number) => {
        const socket = net.createConnection(port, 'smtp-relay.brevo.com');
        socket.setTimeout(5000);
        socket.on('connect', () => {
          results[`port_${port}`] = 'OPEN';
          socket.destroy();
          if (--pending === 0) resolve(results);
        });
        socket.on('error', (err: any) => {
          results[`port_${port}`] = `BLOCKED: ${err.message}`;
          if (--pending === 0) resolve(results);
        });
        socket.on('timeout', () => {
          results[`port_${port}`] = 'TIMEOUT';
          socket.destroy();
          if (--pending === 0) resolve(results);
        });
      };
      
      check(587);
      check(465);
      check(2525);
    });
  }
}
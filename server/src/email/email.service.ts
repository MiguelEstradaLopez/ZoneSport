import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('[EMAIL] GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET');
    console.log('[EMAIL] GMAIL_PASS:', process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: `¡Bienvenido a ZoneSport, ${firstName}!`,
        html: `
          <div style="background:#18181b;color:#fff;font-family:sans-serif;padding:24px;border-radius:8px">
            <h2>¡Bienvenido a ZoneSport, ${firstName}!</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <ul style="margin:16px 0;padding-left:20px">
              <li>Participar en eventos deportivos</li>
              <li>Crear tus propios eventos</li>
              <li>Conectar con otros deportistas</li>
              <li>Seguir las noticias de tu deporte favorito</li>
            </ul>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background:#22c55e;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Acceder a ZoneSport</a>
            </p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0">
            <p style="font-size:12px;color:#888">ZoneSport - Plataforma de Gestión de Deportes</p>
          </div>
        `,
      });
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send welcome email: ${err.message}`);
    }
  }

  async sendLoginNotification(email: string, firstName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Nuevo inicio de sesión en ZoneSport',
        html: `
          <div style="background:#18181b;color:#fff;font-family:sans-serif;padding:24px;border-radius:8px">
            <h2>Hola ${firstName},</h2>
            <p>Se ha iniciado sesión en tu cuenta de ZoneSport.</p>
            <p>Fecha y hora: ${new Date().toLocaleString('es-CO')}</p>
            <p style="color:#aaa;font-size:12px">Si no fuiste tú, cambia tu contraseña inmediatamente.</p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0">
            <p style="font-size:12px;color:#888">ZoneSport - Plataforma de Gestión de Deportes</p>
          </div>
        `,
      });
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send login notification: ${err.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recupera tu contraseña de ZoneSport',
        html: `
          <div style="background:#18181b;color:#fff;font-family:sans-serif;padding:24px;border-radius:8px">
            <h2>Hola ${firstName},</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña en ZoneSport.</p>
            <p>
              <a href="${resetLink}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Restablecer Contraseña</a>
            </p>
            <p>O copia este enlace: ${resetLink}</p>
            <p style="color:#aaa;font-size:12px">Este enlace expirará en 1 hora.</p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0">
            <p style="font-size:12px;color:#888">ZoneSport - Plataforma de Gestión de Deportes</p>
          </div>
        `,
      });
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send password reset email: ${err.message}`);
    }
  }

  async sendVerificationEmail(email: string, firstName: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Verifica tu correo en ZoneSport',
        html: `
          <div style="background:#18181b;color:#fff;font-family:sans-serif;padding:24px;border-radius:8px">
            <h2>Hola ${firstName},</h2>
            <p>Tu cuenta ha sido creada. Para activar todas las funciones, verifica tu correo.</p>
            <p style="font-size:32px;font-weight:bold;margin:24px 0;letter-spacing:8px;color:#22c55e">${code}</p>
            <p>Este código es válido por 15 minutos.</p>
            <hr style="border:none;border-top:1px solid #333;margin:24px 0">
            <p style="font-size:12px;color:#888">ZoneSport - Plataforma de Gestión de Deportes</p>
          </div>
        `,
      });
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to send verification email: ${err.message}`);
    }
  }

  verifyTransporter(): void {
    // Verify transporter connection asynchronously and log result
    try {
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('[EMAIL] SMTP connection failed:', error.message);
        } else {
          console.log('[EMAIL] SMTP connection successful, ready to send emails');
        }
      });
    } catch (err: any) {
      console.error('[EMAIL] Error during transporter.verify():', err?.message || err);
    }
  }
}
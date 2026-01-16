import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configurar con variables de entorno o credenciales locales
        // Para desarrollo, puedes usar servicios como Mailtrap o tu propio SMTP
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true' || false, // true para 465, false para otros
            auth: {
                user: process.env.SMTP_USER || process.env.GMAIL_USER,
                pass: process.env.SMTP_PASSWORD || process.env.GMAIL_PASSWORD,
            },
        });
    }

    async sendPasswordResetEmail(
        email: string,
        firstName: string,
        resetLink: string,
    ): Promise<void> {
        const mailOptions = {
            from:
                process.env.SMTP_FROM ||
                process.env.GMAIL_USER ||
                'noreply@zonesport.com',
            to: email,
            subject: 'Recupera tu contraseña en ZoneSport',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hola ${firstName},</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña en ZoneSport.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </p>
          <p>O copia este enlace en tu navegador: ${resetLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Este enlace expirará en 1 hora. Si no solicitaste esta recuperación, ignora este correo.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">ZoneSport - Plataforma de Gestión de Deportes</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            const err = error as Error;
            console.error(`Error sending password reset email to ${email}:`, error);
            throw new Error(`Failed to send password reset email: ${err.message}`);
        }
    }

    async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
        const mailOptions = {
            from:
                process.env.SMTP_FROM ||
                process.env.GMAIL_USER ||
                'noreply@zonesport.com',
            to: email,
            subject: 'Bienvenido a ZoneSport',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>¡Bienvenido a ZoneSport, ${firstName}!</h2>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p>Ahora puedes:</p>
          <ul>
            <li>Participar en eventos deportivos</li>
            <li>Crear tus propios eventos</li>
            <li>Conectar con otros deportistas</li>
            <li>Seguir las noticias de tu deporte favorito</li>
          </ul>
          <p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acceder a ZoneSport
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">ZoneSport - Plataforma de Gestión de Deportes</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
        } catch (error) {
            const err = error as Error;
            console.error(`Error sending welcome email to ${email}:`, error);
            throw new Error(`Failed to send welcome email: ${err.message}`);
        }
    }
}

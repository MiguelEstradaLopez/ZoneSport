import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    // Configurar Resend con API key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetLink: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@zonesport.com',
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
      });
      console.log(`[EMAIL] Password reset email sent to ${email}`);
    } catch (error) {
      const err = error as Error;
      console.error(`[EMAIL] Error sending password reset email to ${email}:`, err.message);
      throw new Error(`Failed to send password reset email: ${err.message}`);
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@zonesport.com',
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
      });
      console.log(`[EMAIL] Welcome email sent to ${email}`);
    } catch (error) {
      const err = error as Error;
      console.error(`[EMAIL] Error sending welcome email to ${email}:`, err.message);
      throw new Error(`Failed to send welcome email: ${err.message}`);
    }
  }
}

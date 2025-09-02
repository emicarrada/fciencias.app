import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Para desarrollo, usar un transportador que imprima en consola
    if (configService.get('NODE_ENV') === 'development') {
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    } else {
      // Configuración para producción (usando Gmail SMTP)
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/verify?token=${token}`;
    
    const mailOptions = {
      from: `"FCiencias UNAM" <${this.configService.get('EMAIL_USER')}>`,
      to: email,
      subject: 'Verifica tu correo institucional - FCiencias UNAM',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifica tu correo - FCiencias</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">¡Bienvenido a FCiencias!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Verifica tu correo institucional para continuar</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1e40af; margin-top: 0;">Confirma tu cuenta</h2>
            
            <p>Hola,</p>
            
            <p>Has solicitado crear una cuenta en <strong>FCiencias</strong>, la plataforma oficial de la Facultad de Ciencias de la UNAM.</p>
            
            <p>Para completar tu registro y activar tu cuenta, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verificar mi correo
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
            </p>
            <p style="font-size: 14px; color: #1e40af; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px;">
              ${verificationUrl}
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="font-size: 14px; color: #666; margin: 0;">
                <strong>Importante:</strong> Este enlace expirará en 15 minutos por seguridad.
              </p>
              <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
                Si no solicitaste esta cuenta, puedes ignorar este correo.
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              © 2024 Facultad de Ciencias, UNAM. Todos los derechos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      if (this.configService.get('NODE_ENV') === 'development') {
        // En desarrollo, imprimir el email en consola
        console.log('\n🔗 EMAIL DE VERIFICACIÓN GENERADO:');
        console.log('=====================================');
        console.log(`Para: ${email}`);
        console.log(`Asunto: ${mailOptions.subject}`);
        console.log(`Enlace de verificación: ${verificationUrl}`);
        console.log('=====================================\n');
        
        // Para testing, también podemos "enviar" el email al stream
        const info = await this.transporter.sendMail(mailOptions);
        console.log('📧 Email simulado enviado:', info.messageId);
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `"FCiencias UNAM" <${this.configService.get('EMAIL_USER')}>`,
      to: email,
      subject: '¡Bienvenido a FCiencias UNAM! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>¡Bienvenido a FCiencias!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">¡Bienvenido, ${firstName}! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Tu cuenta ha sido verificada exitosamente</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #059669; margin-top: 0;">¡Ya eres parte de FCiencias!</h2>
            
            <p>Hola ${firstName},</p>
            
            <p>¡Felicidades! Tu cuenta en <strong>FCiencias</strong> ha sido verificada exitosamente. Ahora puedes disfrutar de todas las funciones de nuestra plataforma.</p>
            
            <h3 style="color: #1e40af;">¿Qué puedes hacer ahora?</h3>
            <ul style="color: #666;">
              <li>🎯 Participar en anuncios y eventos de la facultad</li>
              <li>👥 Conectar con estudiantes de tu carrera</li>
              <li>📚 Acceder a recursos académicos exclusivos</li>
              <li>🗣️ Unirte a comunidades de estudio</li>
              <li>📅 Estar al día con eventos académicos</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard" 
                 style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Ir a mi Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              © 2024 Facultad de Ciencias, UNAM. Todos los derechos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      if (this.configService.get('NODE_ENV') === 'development') {
        // En desarrollo, imprimir el email de bienvenida en consola
        console.log('\n🎉 EMAIL DE BIENVENIDA GENERADO:');
        console.log('==================================');
        console.log(`Para: ${email}`);
        console.log(`Usuario: ${firstName}`);
        console.log(`Asunto: ${mailOptions.subject}`);
        console.log('==================================\n');
      } else {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // No lanzar error aquí, el welcome email no es crítico
    }
  }
}

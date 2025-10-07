// Utility functions for API routes
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Database connection
let prisma: PrismaClient | null = null;

export async function initializePrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
  return prisma;
}

// Email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fciencias.app@gmail.com',
    pass: 'fjrd mcls xhaw wlry', // App password
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fciencias.app'}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: '"FCiencias UNAM" <fciencias.app@gmail.com>',
    to: email,
    subject: 'Verifica tu correo institucional - FCiencias UNAM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F2937;">¡Bienvenido a FCiencias UNAM! 🎓</h2>
        
        <p>Tu cuenta ha sido creada exitosamente. Para completar el proceso y activar tu cuenta, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Verificar correo electrónico
          </a>
        </div>
        
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1F2937; margin-top: 0;">🔐 Información importante sobre tu cuenta:</h3>
          <ul style="color: #4B5563; margin: 10px 0; padding-left: 20px;">
            <li>Tu contraseña está segura y encriptada en nuestros servidores</li>
            <li>Nunca enviaremos tu contraseña por email</li>
            <li>Guarda tu contraseña en un lugar seguro</li>
            <li>Después de verificar tu email, podrás iniciar sesión con tu correo y contraseña</li>
          </ul>
        </div>
        
        <p><strong>¿Por qué verificamos tu correo?</strong></p>
        <p>La verificación nos ayuda a mantener una comunidad segura y auténtica de estudiantes y académicos de la Facultad de Ciencias.</p>
        
        <p style="color: #6B7280; font-size: 14px;">
          Si no solicitaste este registro, puedes ignorar este mensaje.
          <br><br>
          Este enlace expirará en 24 horas por seguridad.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        
        <p style="color: #6B7280; font-size: 12px; text-align: center;">
          FCiencias UNAM - Red Social Académica
          <br>
          Facultad de Ciencias, Universidad Nacional Autónoma de México
        </p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error };
  }
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos una letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos una letra mayúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos un número' };
  }
  
  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos un carácter especial (!@#$%^&*)' };
  }
  
  return { valid: true };
}

// Generate random verification token
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Career enum mapping
export const careerMapping: Record<string, string> = {
  '1': 'MATEMATICAS',
  '2': 'FISICA',
  '3': 'CIENCIAS_COMPUTACION',
  '4': 'BIOLOGIA',
  '5': 'CIENCIAS_TIERRA',
  '6': 'ACTUARIA',
  '7': 'MATEMATICAS_APLICADAS',
  '8': 'FISICA_BIOMEDICA'
};

export function mapCareerIdToEnum(careerId: string): string | null {
  return careerMapping[careerId] || null;
}

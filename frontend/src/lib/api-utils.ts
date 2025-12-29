// Utility functions for API routes
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
    user: process.env.GMAIL_USER || 'fciencias.app@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '', // App password from environment
  },
});

// Email sender configuration
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'FCiencias UNAM';
const EMAIL_FROM_ADDRESS = process.env.GMAIL_USER || 'fciencias.app@gmail.com';

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fciencias.app'}/auth/verify?token=${token}`;
  
  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Verifica tu correo institucional - FCiencias UNAM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F2937;">¡Bienvenido a FCiencias UNAM! 🎓</h2>
        
        <p>Tu cuenta ha sido creada exitosamente. Para completar el proceso y activar tu cuenta, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verificar mi correo
          </a>
        </div>
        
        <p style="color: #6B7280; font-size: 14px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        
        <p style="color: #6B7280; font-size: 14px;">
          Este enlace expirará en 24 horas.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        
        <p style="color: #9CA3AF; font-size: 12px;">
          Si no creaste esta cuenta, ignora este correo.
        </p>
      </div>
    `,
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

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fciencias.app'}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Recuperación de contraseña - FCiencias UNAM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F2937;">Recuperación de contraseña 🔐</h2>
        
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer contraseña
          </a>
        </div>
        
        <p style="color: #6B7280; font-size: 14px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        
        <p style="color: #EF4444; font-size: 14px; font-weight: bold;">
          ⚠️ Este enlace expirará en 1 hora por seguridad.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        
        <p style="color: #9CA3AF; font-size: 12px;">
          Si no solicitaste restablecer tu contraseña, ignora este correo. Tu contraseña no cambiará.
        </p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
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

// Re-export password validation from validators (DRY principle - single source of truth)
export { validatePassword } from './validators';

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

// JWT utilities
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

export interface VerificationToken {
  id: string;
  token: string;
  email: string;
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async createEmailVerificationToken(email: string): Promise<string> {
    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Expiración en 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Invalidar tokens anteriores
    await this.prisma.verificationToken.updateMany({
      where: {
        email,
        type: 'EMAIL_VERIFICATION',
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Crear nuevo token
    await this.prisma.verificationToken.create({
      data: {
        token: hashedToken,
        email,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
        used: false,
      },
    });

    return token; // Retornamos el token sin hash para el email
  }

  async verifyEmailToken(token: string): Promise<{ email: string; valid: boolean }> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: 'EMAIL_VERIFICATION',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      return { email: '', valid: false };
    }

    // Marcar token como usado
    await this.prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    return { email: tokenRecord.email, valid: true };
  }

  async createPasswordResetToken(email: string): Promise<string> {
    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Expiración en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Invalidar tokens anteriores
    await this.prisma.verificationToken.updateMany({
      where: {
        email,
        type: 'PASSWORD_RESET',
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Crear nuevo token
    await this.prisma.verificationToken.create({
      data: {
        token: hashedToken,
        email,
        type: 'PASSWORD_RESET',
        expiresAt,
        used: false,
      },
    });

    return token;
  }

  async verifyPasswordResetToken(token: string): Promise<{ email: string; valid: boolean }> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: 'PASSWORD_RESET',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      return { email: '', valid: false };
    }

    // Marcar token como usado
    await this.prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    return { email: tokenRecord.email, valid: true };
  }

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.verificationToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });

    return result.count;
  }
}

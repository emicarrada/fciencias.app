import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, generateVerificationToken, sendPasswordResetEmail } from '@/lib/api-utils';
import { VALIDATION } from '@/lib/constants';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validar email
    if (!email || !VALIDATION.EMAIL_REGEX.test(email)) {
      return NextResponse.json({ 
        success: false,
        message: 'Email inválido' 
      }, { status: 400 });
    }

    const db = await initializePrisma();

    // Buscar usuario
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    // Por seguridad, siempre responder success aunque el usuario no exista
    // Esto evita que atacantes puedan enumerar usuarios
    if (!user) {
      logger.warn('Password reset requested for non-existent email', { email });
      
      // Esperar un poco para simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña'
      }, { status: 200 });
    }

    // Generar token de reset
    const resetToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + VALIDATION.TOKEN_EXPIRY.PASSWORD_RESET);

    // Guardar token en BD
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt
      }
    });

    // Enviar email
    await sendPasswordResetEmail(user.email, resetToken);

    logger.info('Password reset email sent', { email: user.email });

    return NextResponse.json({
      success: true,
      message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña'
    }, { status: 200 });

  } catch (error: any) {
    logger.error('Error in forgot-password', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

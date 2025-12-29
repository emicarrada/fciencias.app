import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, hashPassword } from '@/lib/api-utils';
import { VALIDATION } from '@/lib/constants';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Validar datos
    if (!token || !newPassword) {
      return NextResponse.json({ 
        success: false,
        message: 'Token y nueva contraseña son requeridos' 
      }, { status: 400 });
    }

    if (newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json({ 
        success: false,
        message: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres` 
      }, { status: 400 });
    }

    const db = await initializePrisma();

    // Buscar usuario por token
    const user = await db.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date() // Token no expirado
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Token inválido o expirado. Solicita uno nuevo.' 
      }, { status: 400 });
    }

    // Hash nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña y limpiar tokens
    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    // Invalidar refresh tokens existentes por seguridad
    await db.refreshToken.deleteMany({
      where: { userId: user.id }
    });

    logger.auth.login(user.email, true);
    logger.info('Password reset successful', { userId: user.id });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.'
    }, { status: 200 });

  } catch (error: any) {
    logger.error('Error in reset-password', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al restablecer contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, sendVerificationEmail, generateVerificationToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken?.value) {
      return NextResponse.json({ 
        success: false,
        message: 'No autenticado' 
      }, { status: 401 });
    }

    const tokenPayload = verifyToken(authToken.value);
    if (!tokenPayload) {
      return NextResponse.json({ 
        success: false,
        message: 'Token inválido' 
      }, { status: 401 });
    }

    const db = await initializePrisma();

    // Obtener usuario
    const user = await db.user.findUnique({
      where: { id: tokenPayload.userId }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    // Verificar si ya está verificado
    if (user.isEmailVerified) {
      return NextResponse.json({ 
        success: false,
        message: 'Tu correo ya está verificado' 
      }, { status: 400 });
    }

    // SIN LÍMITE DE TIEMPO - Facilitar al usuario

    // Generar nuevo token
    const verificationToken = generateVerificationToken();

    // INVALIDAR tokens anteriores no usados
    await db.verificationToken.updateMany({
      where: {
        email: user.email,
        type: 'EMAIL_VERIFICATION',
        used: false
      },
      data: {
        used: true // Marcar como usados
      }
    });

    // Crear nuevo token
    await db.verificationToken.create({
      data: {
        token: verificationToken,
        email: user.email,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    });

    // Actualizar usuario
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationSentAt: new Date()
      }
    });

    // Enviar email
    const result = await sendVerificationEmail(user.email, verificationToken);

    if (!result.success) {
      throw new Error('Error al enviar el correo');
    }

    console.log(`✅ Correo de verificación reenviado a ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Correo de verificación enviado. Revisa tu bandeja de entrada.'
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error al reenviar verificación:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Error al enviar correo de verificación'
    }, { status: 500 });
  }
}

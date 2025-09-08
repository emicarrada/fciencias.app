import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Token de verificación requerido' 
      }, { status: 400 });
    }

    const db = await initializePrisma();

    // Buscar el token en la base de datos
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token: token,
        type: 'EMAIL_VERIFICATION'
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ 
        success: false,
        message: 'Token de verificación no encontrado. Es posible que ya haya sido usado o sea inválido.' 
      }, { status: 400 });
    }

    // Verificar si el token ha expirado
    if (verificationToken.expiresAt < new Date()) {
      // Eliminar el token expirado
      await db.verificationToken.delete({
        where: { id: verificationToken.id }
      });
      
      return NextResponse.json({ 
        success: false,
        message: 'El token de verificación ha expirado. Por favor, solicita un nuevo enlace de verificación registrándote nuevamente.',
        expired: true
      }, { status: 400 });
    }

    // Buscar el usuario
    const user = await db.user.findUnique({
      where: { email: verificationToken.email }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        message: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    if (user.isEmailVerified) {
      // Eliminar token usado
      await db.verificationToken.delete({
        where: { id: verificationToken.id }
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'El correo ya está verificado' 
      });
    }

    // Verificar el correo
    await db.user.update({
      where: { email: verificationToken.email },
      data: { isEmailVerified: true }
    });

    // Eliminar el token de verificación usado
    await db.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    console.log(`✅ Email verificado: ${verificationToken.email}`);

    return NextResponse.json({ 
      success: true,
      message: 'Correo verificado exitosamente' 
    });

  } catch (error) {
    console.error('❌ Error en verificación:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

/**
 * ENDPOINT DE DESARROLLO: Marca el email como verificado sin necesidad de verificación
 * Solo para facilitar testing - REMOVER EN PRODUCCIÓN
 */
export async function POST(request: NextRequest) {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      success: false,
      message: 'Este endpoint solo está disponible en desarrollo' 
    }, { status: 403 });
  }

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

    // Marcar como verificado
    const user = await db.user.update({
      where: { id: tokenPayload.userId },
      data: { isEmailVerified: true }
    });

    console.log(`✅ [DEV] Email verificado automáticamente para: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Email marcado como verificado (modo desarrollo)',
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error al verificar:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Error al verificar'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    // Validar username
    if (!username || username.trim().length === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'El nombre de usuario es requerido' 
      }, { status: 400 });
    }

    // Validar formato (alfanumérico, guiones, guiones bajos, 3-20 caracteres)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ 
        success: false,
        message: 'El nombre de usuario debe tener entre 3-20 caracteres y solo puede contener letras, números, guiones y guiones bajos' 
      }, { status: 400 });
    }

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

    // Verificar si el username ya existe
    const existingUser = await db.user.findUnique({
      where: { username: username.trim() }
    });

    if (existingUser && existingUser.id !== tokenPayload.userId) {
      return NextResponse.json({ 
        success: false,
        message: 'Este nombre de usuario ya está en uso' 
      }, { status: 400 });
    }

    // Actualizar username
    const updatedUser = await db.user.update({
      where: { id: tokenPayload.userId },
      data: { username: username.trim() }
    });

    console.log(`✅ Username configurado: ${username} para usuario ${updatedUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'Nombre de usuario configurado exitosamente',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error al configurar username:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Error al configurar nombre de usuario'
    }, { status: 500 });
  }
}

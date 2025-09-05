import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, isInstitutionalEmail, comparePassword } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    if (!isInstitutionalEmail(email)) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const db = await initializePrisma();
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json({ message: 'Debes verificar tu correo antes de iniciar sesión' }, { status: 401 });
    }

    const validPassword = await comparePassword(password, user.hashedPassword);

    if (!validPassword) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Aquí generarías JWT tokens en una implementación completa
    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// Options for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

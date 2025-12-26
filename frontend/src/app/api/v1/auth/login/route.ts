import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, comparePassword } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username y contraseña son requeridos' }, { status: 400 });
    }

    const db = await initializePrisma();
    const user = await db.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
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
        username: user.username,
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

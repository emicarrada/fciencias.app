/**
 * POST /api/v1/auth/update-email
 * Actualiza el email del usuario autenticado
 * Body: { email: string }
 */

import { NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validar email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Obtener token de autenticación desde cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    const payload = verifyToken(authToken);
    if (!payload) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const prisma = await initializePrisma();

    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== payload.userId) {
      return NextResponse.json(
        { message: 'Este correo ya está en uso' },
        { status: 409 }
      );
    }

    // Actualizar email del usuario
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { 
        email,
        isEmailVerified: false, // Reset verification status
      },
      select: {
        id: true,
        username: true,
        email: true,
        isEmailVerified: true,
        role: true,
        career: true,
        avatarColor: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


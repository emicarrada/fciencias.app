import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, validatePassword, hashPassword } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos en /api/v1/auth/register:', body);
    
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Email y password son requeridos' 
      }, { status: 400 });
    }

    // Validar email básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ 
        success: false,
        message: 'Formato de email inválido' 
      }, { status: 400 });
    }

    // Validar password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        success: false,
        message: passwordValidation.message 
      }, { status: 400 });
    }

    const db = await initializePrisma();

    // Verificar si el email ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: false,
        message: 'Este email ya está en uso' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await db.user.create({
      data: {
        email,
        hashedPassword,
        role: 'STUDENT',
        avatarColor: getRandomAvatarColor(),
        isEmailVerified: true,
        isActive: true
      }
    });

    console.log(`✅ Usuario registrado: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: user.id,
      email: user.email
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 });
  }
}

function getRandomAvatarColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

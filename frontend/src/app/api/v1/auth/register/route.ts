import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, validatePassword, hashPassword } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos en /api/v1/auth/register:', body);
    
    const { username, password } = body;

    // Validaciones básicas
    if (!username || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Username y password son requeridos' 
      }, { status: 400 });
    }

    // Validar username (al menos 3 caracteres, alfanumérico)
    if (username.length < 3) {
      return NextResponse.json({ 
        success: false,
        message: 'El username debe tener al menos 3 caracteres' 
      }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ 
        success: false,
        message: 'El username solo puede contener letras, números y guiones bajos' 
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

    // Verificar si el username ya existe
    const existingUser = await db.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: false,
        message: 'Este username ya está en uso' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await db.user.create({
      data: {
        username,
        hashedPassword,
        role: 'STUDENT',
        avatarColor: getRandomAvatarColor(),
        isEmailVerified: true, // No requiere verificación de email
        isActive: true
      }
    });

    console.log(`✅ Usuario registrado: ${username}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: user.id,
      username: user.username
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

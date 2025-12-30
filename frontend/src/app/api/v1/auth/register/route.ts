import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, validatePassword, hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

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
        message: passwordValidation.error // Changed from .message to .error for consistency
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
        isEmailVerified: false, // Usuario debe verificar email (opcional)
        isActive: true
      }
    });

    console.log(`✅ Usuario registrado: ${email}`);

    // Generar JWT tokens para auto-login
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Guardar refresh token en BD
    await db.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    });

    // Establecer cookie httpOnly para el access token
    const cookieStore = await cookies();
    cookieStore.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        username: user.username ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatarColor: user.avatarColor ?? '#4ECDC4',
        career: user.career ?? null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      accessToken,
      refreshToken
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    console.error('Stack:', error.stack);
    
    // Log detallado del error para debugging
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.meta) {
      console.error('Error meta:', error.meta);
    }
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function getRandomAvatarColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, sendVerificationEmail, validatePassword, validateEmail, hashPassword, generateVerificationToken, mapCareerIdToEnum } from '@/lib/api-utils';
import { Career } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, careerId } = body;

    // Validaciones básicas
    if (!name || !email || !password || !careerId) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan campos requeridos (name, email, password, careerId)' 
      }, { status: 400 });
    }

    // Dividir nombre en firstName y lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Usuario';

    if (!validateEmail(email)) {
      return NextResponse.json({ 
        success: false,
        message: 'Formato de email inválido' 
      }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        success: false,
        message: passwordValidation.message 
      }, { status: 400 });
    }

    // Validar carrera
    const career = mapCareerIdToEnum(careerId);
    if (!career) {
      return NextResponse.json({ 
        success: false,
        message: 'Carrera inválida' 
      }, { status: 400 });
    }

    const db = await initializePrisma();

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json({ 
          success: false,
          message: 'Este email ya está registrado y verificado' 
        }, { status: 400 });
      } else {
        // Usuario existe pero no verificado, reenviar verificación
        const verificationToken = generateVerificationToken();
        
        await db.verificationToken.deleteMany({
          where: { 
            email: email,
            type: 'EMAIL_VERIFICATION'
          }
        });

        await db.verificationToken.create({
          data: {
            email,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            type: 'EMAIL_VERIFICATION'
          }
        });

        await sendVerificationEmail(email, verificationToken);
        
        return NextResponse.json({
          success: true,
          message: 'Se ha reenviado el correo de verificación',
          email
        });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        career: career as Career,
        role: 'STUDENT',
        avatarColor: getRandomAvatarColor(),
        isEmailVerified: false
      }
    });

    // Crear token de verificación
    const verificationToken = generateVerificationToken();
    
    await db.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        type: 'EMAIL_VERIFICATION'
      }
    });

    // Enviar email de verificación
    await sendVerificationEmail(email, verificationToken);

    console.log(`✅ Usuario registrado: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
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

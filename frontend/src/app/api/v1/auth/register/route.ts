import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, sendVerificationEmail, validatePassword, validateEmail, hashPassword, generateVerificationToken, mapCareerIdToEnum } from '@/lib/api-utils';
import { Career } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos en /api/v1/auth/register:', body);
    
    // Acepta tanto el formato anterior (name, careerId) como el nuevo (firstName, lastName, career)
    const { 
      name, 
      firstName, 
      lastName, 
      email, 
      password, 
      career,
      careerId 
    } = body;

    // Determinar firstName y lastName
    let finalFirstName: string;
    let finalLastName: string;
    
    if (firstName && lastName) {
      // Formato nuevo del frontend
      finalFirstName = firstName;
      finalLastName = lastName;
    } else if (name) {
      // Formato anterior con name completo
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || '';
      finalLastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Usuario';
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan campos requeridos (name o firstName/lastName, email, password, career o careerId)' 
      }, { status: 400 });
    }

    // Validaciones básicas
    if (!email || !password || (!career && !careerId)) {
      return NextResponse.json({ 
        success: false,
        message: 'Faltan campos requeridos (name o firstName/lastName, email, password, career o careerId)' 
      }, { status: 400 });
    }

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
    let finalCareer: Career;
    
    if (career) {
      // El frontend envía el career directamente como enum
      finalCareer = career as Career;
    } else if (careerId) {
      // Formato anterior con careerId
      const mappedCareer = mapCareerIdToEnum(careerId);
      if (!mappedCareer) {
        return NextResponse.json({ 
          success: false,
          message: 'Carrera inválida' 
        }, { status: 400 });
      }
      finalCareer = mappedCareer as Career;
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Se requiere career o careerId' 
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
        firstName: finalFirstName,
        lastName: finalLastName,
        email,
        hashedPassword,
        career: finalCareer,
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

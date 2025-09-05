import { NextRequest, NextResponse } from "next/server";
import { initializePrisma, sendVerificationEmail, validatePassword, validateEmail, hashPassword, generateVerificationToken, mapCareerIdToEnum } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, careerId } = body;

    // Validaciones básicas
    if (!name || !email || !password || !careerId) {
      return NextResponse.json({ 
        success: false,
        message: "Faltan campos requeridos (name, email, password, careerId)" 
      }, { status: 400 });
    }

    // Dividir nombre en firstName y lastName
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "Usuario";

    if (!validateEmail(email)) {
      return NextResponse.json({ 
        success: false,
        message: "Formato de email inválido" 
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
        message: "Carrera inválida" 
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
          message: "Ya existe una cuenta con este correo electrónico" 
        }, { status: 409 });
      } else {
        // Usuario existe pero no verificado, reenviar email
        const token = generateVerificationToken();
        
        // Actualizar el token de verificación
        await db.verificationToken.deleteMany({
          where: { 
            email: email,
            type: "EMAIL_VERIFICATION"
          }
        });
        
        await db.verificationToken.create({
          data: {
            email: email,
            token,
            type: "EMAIL_VERIFICATION",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
          }
        });

        await sendVerificationEmail(email, token);
        
        return NextResponse.json({
          success: true,
          message: "Se ha reenviado el correo de verificación",
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
        career: career as any, // Type assertion para el enum
        isEmailVerified: false,
      },
    });

    // Generar token de verificación
    const token = generateVerificationToken();
    
    await db.verificationToken.create({
      data: {
        email: email,
        token,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    });

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(email, token);
    
    if (!emailResult.success) {
      console.error("❌ Error enviando email de verificación:", emailResult.error);
      // No fallar el registro por error de email
    }

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente. Revisa tu correo para verificar la cuenta.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        career: user.career
      }
    });

  } catch (error: any) {
    console.error("❌ Error en registro:", error);
    
    // Manejar errores específicos de Prisma
    if (error.code === "P2002") {
      return NextResponse.json({ 
        success: false,
        message: "Ya existe una cuenta con este correo electrónico" 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      success: false,
      message: "Error interno del servidor" 
    }, { status: 500 });
  }
}

// Options for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

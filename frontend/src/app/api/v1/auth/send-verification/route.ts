import { NextResponse } from 'next/server';
import { initializePrisma, sendVerificationEmail, generateVerificationToken } from '@/lib/api-utils';

/**
 * POST /api/v1/auth/send-verification
 * Envía un correo de verificación de email
 * Body: { email: string }
 */
export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  }

  const prisma = await initializePrisma();

  // Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  // Generar token de verificación
  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

  // Invalidar tokens previos no usados
  await prisma.verificationToken.updateMany({
    where: { email, type: 'EMAIL_VERIFICATION', used: false },
    data: { used: true },
  });

  // Guardar nuevo token
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      type: 'EMAIL_VERIFICATION',
      expiresAt,
    },
  });

  // Enviar correo
  await sendVerificationEmail(email, token);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

/**
 * POST /api/v1/auth/verify-email
 * Verifica el token recibido y marca el email como verificado
 * Body: { token: string }
 */
export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
  }

  const prisma = await initializePrisma();

  // Buscar token válido
  const verification = await prisma.verificationToken.findFirst({
    where: {
      token,
      type: 'EMAIL_VERIFICATION',
      used: false,
      expiresAt: { gt: new Date() },
    },
  });
  if (!verification) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
  }

  // Marcar usuario como verificado
  await prisma.user.update({
    where: { email: verification.email },
    data: { isEmailVerified: true },
  });

  // Marcar token como usado
  await prisma.verificationToken.update({
    where: { id: verification.id },
    data: { used: true },
  });

  return NextResponse.json({ ok: true });
}

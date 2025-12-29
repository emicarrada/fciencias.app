import { NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

/**
 * GET /api/v1/auth/check-verification-status?email=...
 * Devuelve el estado de verificación del usuario por email
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  }

  const prisma = await initializePrisma();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    isEmailVerified: user.isEmailVerified,
    email: user.email,
    username: user.username,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Token de verificación requerido' }, { status: 400 });
    }

    // Decodificar token
    const decoded = Buffer.from(token, 'base64').toString();
    const [email, timestamp] = decoded.split(':');

    // Verificar que no haya expirado (24 horas)
    const tokenAge = Date.now() - parseInt(timestamp);
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (tokenAge > twentyFourHours) {
      return NextResponse.json({ message: 'El token de verificación ha expirado' }, { status: 400 });
    }

    const db = await initializePrisma();
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'El correo ya está verificado' });
    }

    // Verificar el correo
    await db.user.update({
      where: { email },
      data: { isEmailVerified: true }
    });

    return NextResponse.json({ message: 'Correo verificado exitosamente' });

  } catch (error) {
    console.error('❌ Error en verificación:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

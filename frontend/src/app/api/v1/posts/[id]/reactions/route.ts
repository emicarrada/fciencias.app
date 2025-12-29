/**
 * POST /api/v1/posts/[id]/reactions - Agregar reacción a un post
 * DELETE /api/v1/posts/[id]/reactions - Eliminar reacción de un post
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST - Agregar reacción
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: postId } = await params;

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(authToken);
    if (!payload) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type } = body;

    // Validar tipo de reacción
    const validTypes = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { message: 'Tipo de reacción inválido' },
        { status: 400 }
      );
    }

    const prisma = await initializePrisma();

    // Verificar que el post existe
    const post = await prisma.announcement.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya existe una reacción del usuario en este post
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        announcementId: postId,
        userId: payload.userId,
      },
    });

    let reaction;

    if (existingReaction) {
      // Si existe, actualizar el tipo de reacción
      reaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: 'Reacción actualizada exitosamente',
        reaction,
      });
    } else {
      // Si no existe, crear nueva reacción
      reaction = await prisma.reaction.create({
        data: {
          type,
          userId: payload.userId,
          announcementId: postId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: 'Reacción agregada exitosamente',
        reaction,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('❌ Error adding reaction:', error);
    return NextResponse.json(
      { message: 'Error al agregar reacción' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar reacción
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: postId } = await params;

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(authToken);
    if (!payload) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const prisma = await initializePrisma();

    // Buscar la reacción del usuario en este post
    const reaction = await prisma.reaction.findFirst({
      where: {
        announcementId: postId,
        userId: payload.userId,
      },
    });

    if (!reaction) {
      return NextResponse.json(
        { message: 'No has reaccionado a este post' },
        { status: 404 }
      );
    }

    // Eliminar la reacción
    await prisma.reaction.delete({
      where: { id: reaction.id },
    });

    return NextResponse.json({
      message: 'Reacción eliminada exitosamente',
    });
  } catch (error) {
    console.error('❌ Error deleting reaction:', error);
    return NextResponse.json(
      { message: 'Error al eliminar reacción' },
      { status: 500 }
    );
  }
}

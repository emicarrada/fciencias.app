/**
 * GET /api/v1/posts/[id]/comments - Obtener comentarios de un post
 * POST /api/v1/posts/[id]/comments - Crear comentario en un post
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Obtener comentarios
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: postId } = params;

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

    const comments = await prisma.comment.findMany({
      where: { announcementId: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarColor: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return NextResponse.json(
      { message: 'Error al obtener comentarios' },
      { status: 500 }
    );
  }
}

// POST - Crear comentario
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: postId } = params;

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
    const { content } = body;

    // Validaciones
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'El contenido del comentario es obligatorio' },
        { status: 400 }
      );
    }

    if (content.length < 1 || content.length > 1000) {
      return NextResponse.json(
        { message: 'El comentario debe tener entre 1 y 1000 caracteres' },
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

    // Crear comentario
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: payload.userId,
        announcementId: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarColor: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Comentario creado exitosamente',
      comment,
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    return NextResponse.json(
      { message: 'Error al crear comentario' },
      { status: 500 }
    );
  }
}

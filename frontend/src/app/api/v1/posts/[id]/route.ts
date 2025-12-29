/**
 * GET /api/v1/posts/[id] - Obtener un post específico
 * PUT /api/v1/posts/[id] - Actualizar post (solo autor)
 * DELETE /api/v1/posts/[id] - Eliminar post (solo autor)
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Obtener post por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const prisma = await initializePrisma();

    const post = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarColor: true,
            career: true,
          },
        },
        comments: {
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
          orderBy: {
            createdAt: 'desc',
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
            comments: true,
            reactions: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    return NextResponse.json(
      { message: 'Error al obtener post' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar post
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

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

    // Verificar que el post existe y pertenece al usuario
    const existingPost = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== payload.userId) {
      return NextResponse.json(
        { message: 'No tienes permiso para editar este post' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category, tags, isPublic } = body;

    // Validaciones
    if (title && (title.length < 5 || title.length > 200)) {
      return NextResponse.json(
        { message: 'El título debe tener entre 5 y 200 caracteres' },
        { status: 400 }
      );
    }

    if (content && content.length < 10) {
      return NextResponse.json(
        { message: 'El contenido debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Actualizar post
    const updatedPost = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(isPublic !== undefined && { isPublic }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarColor: true,
            career: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Post actualizado exitosamente',
      post: updatedPost,
    });
  } catch (error) {
    console.error('❌ Error updating post:', error);
    return NextResponse.json(
      { message: 'Error al actualizar post' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar post
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

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

    // Verificar que el post existe y pertenece al usuario
    const existingPost = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== payload.userId) {
      return NextResponse.json(
        { message: 'No tienes permiso para eliminar este post' },
        { status: 403 }
      );
    }

    // Eliminar post
    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Post eliminado exitosamente',
    });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    return NextResponse.json(
      { message: 'Error al eliminar post' },
      { status: 500 }
    );
  }
}

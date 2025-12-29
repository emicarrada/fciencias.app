/**
 * GET /api/v1/posts - Listar posts
 * POST /api/v1/posts - Crear nuevo post
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

// GET - Listar posts con paginación y filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    
    const skip = (page - 1) * limit;

    const prisma = await initializePrisma();

    // Construir filtros
    const where: any = {
      status: 'PUBLISHED',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    // Obtener posts
    const [posts, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
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
          _count: {
            select: {
              comments: true,
              reactions: true,
            },
          },
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.announcement.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Error al obtener posts' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo post
export async function POST(request: NextRequest) {
  try {
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
    const { title, content, category, tags, isPublic } = body;

    // Validaciones
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: 'Título, contenido y categoría son requeridos' },
        { status: 400 }
      );
    }

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { message: 'El título debe tener entre 5 y 200 caracteres' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { message: 'El contenido debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    const prisma = await initializePrisma();

    // Crear post
    const post = await prisma.announcement.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        isPublic: isPublic !== undefined ? isPublic : true,
        authorId: payload.userId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
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

    return NextResponse.json(
      {
        message: 'Post creado exitosamente',
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json(
      { message: 'Error al crear post' },
      { status: 500 }
    );
  }
}

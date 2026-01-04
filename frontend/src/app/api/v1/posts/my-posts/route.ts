import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';

/**
 * GET /api/v1/posts/my-posts - Obtener posts del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(authToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = await initializePrisma();

    // Obtener posts del usuario autenticado en orden cronológico (más recientes primero)
    const posts = await db.post.findMany({
      where: {
        authorId: payload.userId // FILTRAR POR EL USUARIO AUTENTICADO
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarColor: true
          }
        }
      }
    });

    // Formatear respuesta
    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      isAnonymous: post.isAnonymous,
      author: post.isAnonymous ? null : {
        username: post.author.username,
        avatarColor: post.author.avatarColor
      },
      createdAt: post.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        limit,
        offset,
        hasMore: posts.length === limit
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error al obtener posts del usuario:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al cargar tus publicaciones',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

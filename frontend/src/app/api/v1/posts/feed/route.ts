import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = await initializePrisma();

    // Obtener posts en orden cronológico (más recientes primero)
    const posts = await db.post.findMany({
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
    console.error('❌ Error al obtener feed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error al cargar el feed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

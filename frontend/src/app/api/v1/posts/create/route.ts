import { NextRequest, NextResponse } from 'next/server';
import { initializePrisma, verifyToken } from '@/lib/api-utils';
import { cookies } from 'next/headers';
import { validateCreatePost } from '@/middleware/validation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, imageUrl, isAnonymous } = body;

    // Get authentication token
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    // Get user if authenticated
    let user = null;
    if (authToken?.value) {
      const tokenPayload = verifyToken(authToken.value);
      if (tokenPayload) {
        const db = await initializePrisma();
        user = await db.user.findUnique({
          where: { id: tokenPayload.userId }
        });
      }
    }

    // Execute validation chain (Chain of Responsibility pattern)
    const validationResult = validateCreatePost({
      content,
      imageUrl,
      isAnonymous,
      user,
      authToken: authToken?.value,
    });

    // If validation failed, return error
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error,
          ...validationResult.additionalData,
        },
        { status: validationResult.statusCode || 400 }
      );
    }

    // All validations passed - create post
    const db = await initializePrisma();
    
    // At this point, user is guaranteed to exist due to validation chain
    if (!user) {
      throw new Error('User should exist after validation');
    }
    
    const post = await db.post.create({
      data: {
        content: content.trim(),
        imageUrl: imageUrl || null,
        isAnonymous: isAnonymous || false,
        authorId: user.id
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

    logger.post.created(post.id, user.id, isAnonymous || false);

    return NextResponse.json({
      success: true,
      message: 'Post creado exitosamente',
      post: {
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        isAnonymous: post.isAnonymous,
        author: post.isAnonymous ? null : {
          username: post.author.username,
          avatarColor: post.author.avatarColor
        },
        createdAt: post.createdAt.toISOString()
      }
    }, { status: 201 });

  } catch (error: any) {
    logger.post.error('create', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Error al crear el post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

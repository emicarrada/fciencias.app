import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';
import { PaginationOptions, PaginatedResult } from '@/domain/repositories/IRepository';

export interface GetPostsRequest {
  page?: number;
  limit?: number;
  filterBy?: 'all' | 'following' | 'trending' | 'my-career';
  searchQuery?: string;
  authorId?: string;
  tags?: string[];
}

export interface GetPostsResult {
  success: boolean;
  posts?: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  error?: string;
}

/**
 * Use case for getting posts with various filters
 * Contains business logic for post retrieval and filtering
 */
export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: GetPostsRequest, userId?: string): Promise<GetPostsResult> {
    try {
      // Validate and set defaults
      const options = this.buildQueryOptions(request);
      
      let result: PaginatedResult<Post>;

      // Apply filtering based on request
      switch (request.filterBy) {
        case 'following':
          if (!userId) {
            return {
              success: false,
              error: 'Usuario requerido para ver posts de seguidos'
            };
          }
          result = await this.postRepository.findFromFollowedUsers(userId, options);
          break;

        case 'trending':
          result = await this.postRepository.findTrending(options);
          break;

        case 'my-career':
          if (!userId) {
            return {
              success: false,
              error: 'Usuario requerido para ver posts de la carrera'
            };
          }
          // Note: Would need user's career info, simplified for now
          result = await this.postRepository.findAll(options);
          break;

        default:
          if (request.searchQuery) {
            result = await this.postRepository.search(request.searchQuery, options);
          } else if (request.authorId) {
            result = await this.postRepository.findByAuthor(request.authorId, options);
          } else if (request.tags && request.tags.length > 0) {
            result = await this.postRepository.findByTags(request.tags, options);
          } else {
            result = await this.postRepository.findAll(options);
          }
          break;
      }

      // Process and validate results
      const processedPosts = this.processPosts(result.data);

      return {
        success: true,
        posts: processedPosts,
        pagination: result.pagination,
        message: this.getSuccessMessage(request, result.data.length)
      };

    } catch (error: any) {
      console.error('Get posts error:', error);
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  private buildQueryOptions(request: GetPostsRequest): PaginationOptions {
    return {
      page: Math.max(1, request.page || 1),
      limit: Math.min(50, Math.max(1, request.limit || 20)),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }

  private processPosts(posts: Post[]): Post[] {
    // Apply any business logic processing
    return posts.filter(post => {
      // Filter out posts with invalid data
      try {
        // This will throw if post is invalid
        new Post(
          post.id,
          post.content,
          post.author,
          post.createdAt,
          post.updatedAt,
          post.imageUrl,
          post.tags
        );
        return true;
      } catch {
        return false;
      }
    });
  }

  private getSuccessMessage(request: GetPostsRequest, count: number): string {
    if (count === 0) {
      if (request.searchQuery) {
        return 'No se encontraron posts para tu búsqueda';
      }
      if (request.filterBy === 'following') {
        return 'No hay posts de usuarios que sigues';
      }
      return 'No hay posts disponibles';
    }

    if (request.searchQuery) {
      return `Se encontraron ${count} posts`;
    }

    return `${count} posts cargados`;
  }

  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Error al cargar los posts';
  }
}
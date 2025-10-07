import { IPostRepository, CreatePostData } from '@/domain/repositories/IPostRepository';
import { IEventBus } from '@/features/events/infrastructure/EventBusInterfaces';
import { PostCreatedEvent } from '@/features/events/domain/PostEvents';
import { Post } from '@/domain/entities/Post';
import { User } from '@/types/auth';

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  tags?: string[];
  isDraft?: boolean;
}

export interface CreatePostResult {
  success: boolean;
  post?: Post;
  message?: string;
  error?: string;
}

/**
 * Use case for creating a new post
 * Contains business logic and validation for post creation with event publishing
 */
export class CreatePostUseCase {
  constructor(
    private postRepository: IPostRepository,
    private eventBus?: IEventBus
  ) {}

  async execute(
    request: CreatePostRequest, 
    author: User
  ): Promise<CreatePostResult> {
    try {
      // Validate input
      const validation = this.validatePostData(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Validate author
      if (!author || !author.id) {
        return {
          success: false,
          error: 'Usuario no válido'
        };
      }

      // Clean and process content
      const cleanContent = this.cleanContent(request.content);
      const processedTags = this.processTags(request.tags || []);

      // Create post data
      const createData: CreatePostData = {
        content: cleanContent,
        authorId: author.id,
        imageUrl: request.imageUrl,
        tags: processedTags,
        isDraft: request.isDraft || false
      };

      // Create post through repository
      const post = await this.postRepository.create(createData);

      // Publish PostCreatedEvent if eventBus is available
      if (this.eventBus) {
        try {
          const postCreatedEvent = new PostCreatedEvent(post, {
            correlationId: `post-creation-${post.id}`,
            userId: author.id
          });

          await this.eventBus.publish(postCreatedEvent);
        } catch (eventError) {
          // Log event publishing error but don't fail the post creation
          console.error('Failed to publish PostCreatedEvent:', eventError);
        }
      }

      return {
        success: true,
        post,
        message: request.isDraft ? 'Borrador guardado' : 'Post creado exitosamente'
      };

    } catch (error: any) {
      console.error('Create post error:', error);
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  private validatePostData(request: CreatePostRequest): { isValid: boolean; error?: string } {
    // Content validation
    if (!request.content || request.content.trim().length === 0) {
      return {
        isValid: false,
        error: 'El contenido del post es requerido'
      };
    }

    if (request.content.length > 1000) {
      return {
        isValid: false,
        error: 'El contenido no puede exceder 1000 caracteres'
      };
    }

    // Image URL validation
    if (request.imageUrl && !this.isValidImageUrl(request.imageUrl)) {
      return {
        isValid: false,
        error: 'URL de imagen no válida'
      };
    }

    // Tags validation
    if (request.tags && request.tags.length > 10) {
      return {
        isValid: false,
        error: 'No se pueden agregar más de 10 etiquetas'
      };
    }

    if (request.tags && request.tags.some(tag => tag.length > 50)) {
      return {
        isValid: false,
        error: 'Las etiquetas no pueden exceder 50 caracteres'
      };
    }

    return { isValid: true };
  }

  private cleanContent(content: string): string {
    return content
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with max 2
  }

  private processTags(tags: string[]): string[] {
    return tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
      .filter((tag, index, array) => array.indexOf(tag) === index) // Remove duplicates
      .slice(0, 10); // Max 10 tags
  }

  private isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Error al crear el post';
  }
}
import { IReactionRepository } from '@/domain/repositories/IReactionRepository';
import { ReactionType, Reaction } from '@/domain/value-objects/Reaction';
import { IEventBus } from '@/features/events/infrastructure/EventBusInterfaces';
import { PostReactionAddedEvent, PostReactionRemovedEvent, PostReactionChangedEvent } from '@/features/events/domain/ReactionEvents';

export interface ReactToPostRequest {
  postId: string;
  reactionType: ReactionType;
}

export interface ReactToPostResult {
  success: boolean;
  reaction?: Reaction;
  previousReaction?: Reaction;
  message?: string;
  error?: string;
}

/**
 * Use case for reacting to a post
 * Contains business logic for post reactions with event publishing
 */
export class ReactToPostUseCase {
  constructor(
    private reactionRepository: IReactionRepository,
    private eventBus?: IEventBus
  ) {}

  async execute(
    request: ReactToPostRequest,
    userId: string
  ): Promise<ReactToPostResult> {
    try {
      // Validate input
      const validation = this.validateRequest(request, userId);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Check if user already reacted to this post
      const existingReaction = await this.reactionRepository.findUserReaction(
        request.postId,
        userId
      );

      let result: Reaction;
      let message: string;
      let previousReaction: Reaction | undefined;

      if (existingReaction) {
        // User already reacted
        if (existingReaction.type === request.reactionType) {
          // Same reaction type - remove it
          await this.reactionRepository.removeReaction(request.postId, userId);
          
          // Publish PostReactionRemovedEvent if eventBus is available
          if (this.eventBus) {
            try {
              const reactionRemovedEvent = new PostReactionRemovedEvent(
                request.postId,
                'unknown', // TODO: Get actual post author ID
                userId,
                existingReaction,
                {
                  correlationId: `reaction-removed-${request.postId}-${userId}`
                }
              );
              await this.eventBus.publish(reactionRemovedEvent);
            } catch (eventError) {
              console.error('Failed to publish PostReactionRemovedEvent:', eventError);
            }
          }

          return {
            success: true,
            previousReaction: existingReaction,
            message: 'Reacción eliminada'
          };
        } else {
          // Different reaction type - update it
          previousReaction = existingReaction;
          result = await this.reactionRepository.reactToPost(
            request.postId,
            userId,
            request.reactionType
          );
          
          // Publish PostReactionChangedEvent if eventBus is available
          if (this.eventBus) {
            try {
              const reactionChangedEvent = new PostReactionChangedEvent(
                request.postId,
                'unknown', // TODO: Get actual post author ID
                userId,
                existingReaction,
                result,
                {
                  correlationId: `reaction-changed-${request.postId}-${userId}`
                }
              );
              await this.eventBus.publish(reactionChangedEvent);
            } catch (eventError) {
              console.error('Failed to publish PostReactionChangedEvent:', eventError);
            }
          }

          message = 'Reacción actualizada';
        }
      } else {
        // New reaction
        result = await this.reactionRepository.reactToPost(
          request.postId,
          userId,
          request.reactionType
        );
        
        // Publish PostReactionAddedEvent if eventBus is available
        if (this.eventBus) {
          try {
            const reactionAddedEvent = new PostReactionAddedEvent(
              request.postId,
              'unknown', // TODO: Get actual post author ID
              userId,
              result,
              {
                correlationId: `reaction-added-${request.postId}-${userId}`
              }
            );
            await this.eventBus.publish(reactionAddedEvent);
          } catch (eventError) {
            console.error('Failed to publish PostReactionAddedEvent:', eventError);
          }
        }
        
        message = 'Reacción agregada';
      }

      return {
        success: true,
        reaction: result,
        previousReaction,
        message
      };

    } catch (error: any) {
      console.error('React to post error:', error);
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  private validateRequest(
    request: ReactToPostRequest, 
    userId: string
  ): { isValid: boolean; error?: string } {
    // User validation
    if (!userId || userId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Usuario requerido'
      };
    }

    // Post ID validation
    if (!request.postId || request.postId.trim().length === 0) {
      return {
        isValid: false,
        error: 'ID de post requerido'
      };
    }

    // Reaction type validation
    if (!Object.values(ReactionType).includes(request.reactionType)) {
      return {
        isValid: false,
        error: 'Tipo de reacción no válido'
      };
    }

    return { isValid: true };
  }

  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Error al procesar la reacción';
  }
}
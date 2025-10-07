import { IAuthService } from '@/services/interfaces/IAuthService';
import { IEventBus } from '@/features/events/infrastructure/EventBusInterfaces';
import { UserLoggedOutEvent } from '@/features/events/domain/UserEvents';

export interface LogoutResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Use case for user logout
 * Contains business logic for user logout with event publishing
 */
export class LogoutUseCase {
  constructor(
    private authService: IAuthService,
    private eventBus?: IEventBus
  ) {}

  async execute(userId?: string): Promise<LogoutResult> {
    try {
      await this.authService.logout();
      
      // Publish UserLoggedOutEvent if eventBus is available
      if (this.eventBus && userId) {
        try {
          const userLoggedOutEvent = new UserLoggedOutEvent(
            userId,
            'manual',
            undefined, // sessionId
            0, // TODO: Calculate actual session duration
            {
              correlationId: `logout-${userId}-${Date.now()}`
            }
          );
          await this.eventBus.publish(userLoggedOutEvent);
        } catch (eventError) {
          console.error('Failed to publish UserLoggedOutEvent:', eventError);
        }
      }
      
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
      
    } catch (error: any) {
      // Even if server logout fails, we should still consider it successful
      // since local storage will be cleared
      console.error('Logout error:', error);
      
      // Still try to publish the event for tracking
      if (this.eventBus && userId) {
        try {
          const userLoggedOutEvent = new UserLoggedOutEvent(
            userId,
            'forced', // Error occurred, so forced logout
            undefined, // sessionId
            0, // sessionDuration
            {
              correlationId: `logout-error-${userId}-${Date.now()}`
            }
          );
          await this.eventBus.publish(userLoggedOutEvent);
        } catch (eventError) {
          console.error('Failed to publish UserLoggedOutEvent on error:', eventError);
        }
      }
      
      return {
        success: true,
        message: 'Sesión cerrada localmente'
      };
    }
  }
}
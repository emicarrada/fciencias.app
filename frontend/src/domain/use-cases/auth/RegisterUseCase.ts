import { IAuthService } from '@/services/interfaces/IAuthService';
import { IEventBus } from '@/features/events/infrastructure/EventBusInterfaces';
import { UserRegisteredEvent } from '@/features/events/domain/UserEvents';
import { RegisterRequest, UserRole, User } from '@/types/auth';

export interface RegisterResult {
  success: boolean;
  message?: string;
  email?: string;
  error?: string;
}

/**
 * Use case for user registration
 * Contains business logic for user registration with event publishing
 */
export class RegisterUseCase {
  constructor(
    private authService: IAuthService,
    private eventBus?: IEventBus
  ) {}

  async execute(userData: RegisterRequest): Promise<RegisterResult> {
    try {
      // Validate input
      const validation = this.validateRegistrationData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Attempt registration
      const response = await this.authService.register(userData);
      
      // Publish registration event
      if (this.eventBus) {
        try {
          // Create a user object for the event
          // In a real app, the register response would include the created user
          const userForEvent: User = {
            id: `temp_${Date.now()}`, // Would be the actual user ID from response
            email: userData.email,
            isEmailVerified: false,
            role: UserRole.STUDENT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const registrationEvent = new UserRegisteredEvent(
            userForEvent,
            'email', // registration method
            undefined, // ipAddress - would come from request
            undefined  // userAgent - would come from request
          );
          
          await this.eventBus.publish(registrationEvent);
        } catch (eventError) {
          // Don't fail registration if event publishing fails
          console.warn('Failed to publish registration event:', eventError);
        }
      }
      
      return {
        success: true,
        message: response.message,
        email: response.email
      };
      
    } catch (error: any) {
      // Extract meaningful error message
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private validateRegistrationData(userData: RegisterRequest): { isValid: boolean; error?: string } {
    // Required fields
    if (!userData.email || !userData.password) {
      return {
        isValid: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return {
        isValid: false,
        error: 'Formato de email inválido'
      };
    }

    // Password validation
    if (userData.password.length < 6) {
      return {
        isValid: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      };
    }

    return { isValid: true };
  }
}
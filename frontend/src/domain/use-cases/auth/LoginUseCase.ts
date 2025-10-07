import { IAuthService } from '@/services/interfaces/IAuthService';
import { IEventBus } from '@/features/events/infrastructure/EventBusInterfaces';
import { UserLoggedInEvent } from '@/features/events/domain/UserEvents';
import { LoginRequest, User } from '@/types/auth';

export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

/**
 * Use case for user login
 * Contains business logic for authentication with event publishing
 */
export class LoginUseCase {
  constructor(
    private authService: IAuthService,
    private eventBus?: IEventBus
  ) {}

  async execute(credentials: LoginRequest): Promise<LoginResult> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email y contraseña son requeridos'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          error: 'Formato de email inválido'
        };
      }

      // Attempt login
      const authResponse = await this.authService.login(credentials);
      
      if (!authResponse.user) {
        return {
          success: false,
          error: 'Respuesta de autenticación inválida'
        };
      }

      // Publish login event
      if (this.eventBus) {
        try {
          const loginEvent = new UserLoggedInEvent(
            authResponse.user,
            'email', // login method
            undefined, // sessionId - would come from auth service
            undefined, // ipAddress - would come from request
            undefined, // userAgent - would come from request  
            undefined  // previousLoginAt - would come from user data
          );
          
          await this.eventBus.publish(loginEvent);
        } catch (eventError) {
          // Don't fail login if event publishing fails
          console.warn('Failed to publish login event:', eventError);
        }
      }

      return {
        success: true,
        user: authResponse.user,
        message: 'Inicio de sesión exitoso'
      };
      
    } catch (error: any) {
      // Extract meaningful error message
      let errorMessage = 'Error al iniciar sesión';
      
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
}
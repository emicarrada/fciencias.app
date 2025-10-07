import { LoginUseCase } from '@/domain/use-cases/auth/LoginUseCase';
import { IAuthService } from '@/services/interfaces/IAuthService';
import { LoginRequest, User, Career, UserRole } from '@/types/auth';

describe('LoginUseCase', () => {
  let mockAuthService: jest.Mocked<IAuthService>;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      refreshToken: jest.fn(),
      isAuthenticated: jest.fn(),
    };
    
    loginUseCase = new LoginUseCase(mockAuthService);
  });

  describe('execute', () => {
    const validCredentials: LoginRequest = {
      email: 'test@fciencias.unam.mx',
      password: 'password123'
    };

    const mockUser: User = {
      id: '1',
      email: 'test@fciencias.unam.mx',
      firstName: 'Test',
      lastName: 'User',
      career: Career.CIENCIAS_COMPUTACION,
      role: UserRole.STUDENT,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    it('should return success when login is successful', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });

      // Act
      const result = await loginUseCase.execute(validCredentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.message).toBe('Inicio de sesión exitoso');
      expect(mockAuthService.login).toHaveBeenCalledWith(validCredentials);
    });

    it('should return error when email is missing', async () => {
      // Arrange
      const invalidCredentials = { ...validCredentials, email: '' };

      // Act
      const result = await loginUseCase.execute(invalidCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email y contraseña son requeridos');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return error when password is missing', async () => {
      // Arrange
      const invalidCredentials = { ...validCredentials, password: '' };

      // Act
      const result = await loginUseCase.execute(invalidCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email y contraseña son requeridos');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return error when email format is invalid', async () => {
      // Arrange
      const invalidCredentials = { ...validCredentials, email: 'invalid-email' };

      // Act
      const result = await loginUseCase.execute(invalidCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Formato de email inválido');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return error when auth service throws error', async () => {
      // Arrange
      const errorMessage = 'Invalid credentials';
      mockAuthService.login.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await loginUseCase.execute(validCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(mockAuthService.login).toHaveBeenCalledWith(validCredentials);
    });

    it('should return error when response has no user', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValue({
        user: null as any,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });

      // Act
      const result = await loginUseCase.execute(validCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Respuesta de autenticación inválida');
    });

    it('should handle API error responses', async () => {
      // Arrange
      const apiError = {
        response: {
          data: {
            message: 'User not found'
          }
        }
      };
      mockAuthService.login.mockRejectedValue(apiError);

      // Act
      const result = await loginUseCase.execute(validCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });
});
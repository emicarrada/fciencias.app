import { AuthService } from '@/services/auth.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock utility functions
jest.mock('@/lib/api-utils', () => ({
  hashPassword: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  validatePassword: jest.fn((password, hash) => 
    Promise.resolve(hash === `hashed_${password}`)
  ),
  generateAccessToken: jest.fn((userId) => `access_token_${userId}`),
  generateRefreshToken: jest.fn((userId) => `refresh_token_${userId}`),
  sendVerificationEmail: jest.fn(() => Promise.resolve({ success: true })),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('@/lib/token-utils', () => ({
  generateVerificationToken: jest.fn(() => 'mock_verification_token'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a proper mock Prisma instance that passes precondition checks
    mockPrisma = {
      // Required by AuthService constructor precondition check
      $connect: jest.fn().mockResolvedValue(undefined),
      
      // Required by AuthService constructor precondition check  
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      
      verificationToken: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      
      refreshToken: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    
    authService = new AuthService(mockPrisma as any);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      mockPrisma.user.create.mockResolvedValue({
        id: 'user123',
        email: registerData.email,
        password: 'hashed_password123',
        emailVerified: false,
      });
      mockPrisma.verificationToken.create.mockResolvedValue({
        id: 'token123',
        userId: 'user123',
        token: 'mock_verification_token',
      });

      const result = await authService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 'user123',
        email: registerData.email,
        emailVerified: false,
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerData.email,
          password: 'hashed_password123',
          emailVerified: false,
        },
      });
    });

    it('should reject registration with invalid email', async () => {
      const result = await authService.register({
        email: 'invalidemail',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject registration with short password', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: '12345',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('at least 6 characters');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject registration with existing email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing_user',
        email: 'test@example.com',
      });

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already in use');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: loginData.email,
        password: 'hashed_password123',
        username: 'testuser',
        emailVerified: true,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({
        id: 'refresh123',
        token: 'refresh_token_user123',
      });

      const result = await authService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 'user123',
        email: loginData.email,
        username: 'testuser',
        emailVerified: true,
      });
      expect(result.accessToken).toBe('access_token_user123');
      expect(result.refreshToken).toBe('refresh_token_user123');
    });

    it('should reject login with non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should reject login with wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        password: 'hashed_correctpassword',
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid token', async () => {
      const mockToken = 'valid_token';
      const futureDate = new Date(Date.now() + 1000000);

      mockPrisma.verificationToken.findFirst.mockResolvedValue({
        id: 'token123',
        token: mockToken,
        userId: 'user123',
        used: false,
        expiresAt: futureDate,
        user: {
          id: 'user123',
          email: 'test@example.com',
          emailVerified: false,
        },
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 'user123',
        emailVerified: true,
      });
      mockPrisma.verificationToken.update.mockResolvedValue({});

      const result = await authService.verifyEmail(mockToken);

      expect(result.success).toBe(true);
      expect(result.user?.emailVerified).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { emailVerified: true },
      });
    });

    it('should reject expired token', async () => {
      const expiredDate = new Date(Date.now() - 1000);

      mockPrisma.verificationToken.findFirst.mockResolvedValue(null);

      const result = await authService.verifyEmail('expired_token');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    });

    it('should reject used token', async () => {
      mockPrisma.verificationToken.findFirst.mockResolvedValue(null);

      const result = await authService.verifyEmail('used_token');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    });
  });

  describe('requestPasswordReset', () => {
    it('should generate reset token and send email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      });
      mockPrisma.user.update.mockResolvedValue({});

      const result = await authService.requestPasswordReset('test@example.com');

      expect(result.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          passwordResetToken: 'mock_verification_token',
          passwordResetExpires: expect.any(Date),
        },
      });
    });

    it('should return success even if user not found (security)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authService.requestPasswordReset('nonexistent@example.com');

      expect(result.success).toBe(true);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token', async () => {
      const futureDate = new Date(Date.now() + 1000000);

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        passwordResetToken: 'valid_token',
        passwordResetExpires: futureDate,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      const result = await authService.resetPassword('valid_token', 'newpassword123');

      expect(result.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          password: 'hashed_newpassword123',
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
      });
    });

    it('should reject short password', async () => {
      const result = await authService.resetPassword('token', '12345');

      expect(result.success).toBe(false);
      expect(result.error).toContain('at least 6 characters');
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await authService.resetPassword('expired_token', 'newpassword123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    });
  });

  describe('setUsername', () => {
    it('should successfully set username', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // Username not taken
      mockPrisma.user.update.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        username: 'newusername',
      });

      const result = await authService.setUsername('user123', 'newusername');

      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('newusername');
    });

    it('should reject short username', async () => {
      const result = await authService.setUsername('user123', 'ab');

      expect(result.success).toBe(false);
      expect(result.error).toContain('between 3 and 20 characters');
    });

    it('should reject long username', async () => {
      const result = await authService.setUsername('user123', 'a'.repeat(21));

      expect(result.success).toBe(false);
      expect(result.error).toContain('between 3 and 20 characters');
    });

    it('should reject taken username', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'other_user',
        username: 'takenusername',
      });

      const result = await authService.setUsername('user123', 'takenusername');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already taken');
    });
  });
});

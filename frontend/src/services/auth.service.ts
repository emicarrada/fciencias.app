import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/lib/api-utils';
import { generateVerificationToken } from '@/lib/token-utils';
import { IllegalArgumentException, IllegalStateException } from '@/lib/exceptions';
import { logger } from '@/lib/logger';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * AuthService - Business logic for authentication operations
 * Implements Design by Contract with preconditions, postconditions, and invariants
 */
export class AuthService {
  private readonly prisma: PrismaClient;

  /**
   * Constructor with precondition validation (Defensive Programming)
   * @throws {IllegalArgumentException} if prisma is null or undefined
   */
  constructor(prisma: PrismaClient) {
    // PRECONDITION: prisma must be a valid PrismaClient instance
    if (!prisma) {
      throw new IllegalArgumentException(
        'AuthService requires a valid PrismaClient instance. Cannot be null or undefined.'
      );
    }

    // Verify it's actually a PrismaClient (duck typing check)
    if (typeof prisma.$connect !== 'function' || typeof prisma.user !== 'object') {
      throw new IllegalArgumentException(
        'Provided object is not a valid PrismaClient instance. Missing required methods/properties.'
      );
    }

    this.prisma = prisma;
    
    // INVARIANT: prisma will always be non-null during the lifetime of this service
    Object.freeze(this.prisma); // Make it immutable
  }

  /**
   * Validates that the AuthService is in a valid state
   * INVARIANT check - should always pass if constructor succeeded
   */
  private ensureValidState(): void {
    if (!this.prisma) {
      throw new IllegalStateException(
        'AuthService is in an invalid state: prisma client is null'
      );
    }
  }

  /**
   * Validates register data (PRECONDITION)
   * @throws {IllegalArgumentException} if data is invalid
   */
  private validateRegisterData(data: RegisterData): void {
    if (!data) {
      throw new IllegalArgumentException('Register data cannot be null or undefined');
    }

    if (!data.email || typeof data.email !== 'string') {
      throw new IllegalArgumentException('Email is required and must be a string');
    }

    if (!data.password || typeof data.password !== 'string') {
      throw new IllegalArgumentException('Password is required and must be a string');
    }

    if (data.email.trim().length === 0) {
      throw new IllegalArgumentException('Email cannot be empty or whitespace');
    }

    if (data.password.length === 0) {
      throw new IllegalArgumentException('Password cannot be empty');
    }
  }

  /**
   * Ensures created user is in valid state (POSTCONDITION)
   * @throws {IllegalStateException} if user is in invalid state
   */
  private ensureUserValid(user: any): void {
    if (!user) {
      throw new IllegalStateException('User creation failed: returned null or undefined');
    }

    if (!user.id || typeof user.id !== 'string') {
      throw new IllegalStateException(
        'User created in invalid state: missing or invalid id'
      );
    }

    if (!user.email || typeof user.email !== 'string') {
      throw new IllegalStateException(
        'User created in invalid state: missing or invalid email'
      );
    }
  }

  /**
   * Register a new user
   * Implements full Design by Contract with preconditions, postconditions
   */
  async register(data: RegisterData): Promise<AuthResult> {
    // PRECONDITION: Validate invariant
    this.ensureValidState();
    
    // PRECONDITION: Validate input data
    try {
      this.validateRegisterData(data);
    } catch (error) {
      if (error instanceof IllegalArgumentException) {
        return { success: false, error: error.message };
      }
      throw error;
    }

    const { email, password } = data;

    // Validate email format
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }

    // Validate password strength
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return { success: false, error: 'Email already in use' };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          hashedPassword,
          isEmailVerified: false,
        },
      });

      // Generate verification token
      const verificationToken = generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await this.prisma.verificationToken.create({
        data: {
          email: user.email,
          token: verificationToken,
          expiresAt,
        },
      });

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      // POSTCONDITION: Verify user was created correctly
      this.ensureUserValid(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      };
    } catch (error: any) {
      // Don't expose IllegalStateException to external callers
      if (error instanceof IllegalStateException) {
        logger.error('POSTCONDITION VIOLATION in register', error);
        return { success: false, error: 'Internal error: user creation failed' };
      }
      
      logger.error('Registration error', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  /**
   * QUERY: Validate user credentials
   * Returns the user if valid, null otherwise
   * No side effects - pure query
   */
  private async validateCredentials(
    email: string,
    password: string
  ): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await comparePassword(password, user.hashedPassword);

    return isValidPassword ? user : null;
  }

  /**
   * COMMAND: Generate authentication tokens
   * Pure function - no side effects, just creates tokens
   */
  private generateAuthTokens(user: any): {
    accessToken: string;
    refreshToken: string;
  } {
    const tokenPayload = { 
      userId: user.id,
      email: user.email,
      role: user.role || 'user'
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { accessToken, refreshToken };
  }

  /**
   * COMMAND: Store refresh token in database
   * Side effect: writes to database
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  /**
   * Login user - orchestrates CQS operations
   * Uses separated Query and Command methods
   */
  async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    try {
      // QUERY: Validate credentials (no side effects)
      const user = await this.validateCredentials(email, password);

      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // COMMAND: Generate tokens (pure function)
      const { accessToken, refreshToken } = this.generateAuthTokens(user);

      // COMMAND: Store refresh token (side effect)
      await this.storeRefreshToken(user.id, refreshToken);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      logger.error('Login error', error);
      return { success: false, error: 'Login failed' };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const verificationToken = await this.prisma.verificationToken.findFirst({
        where: {
          token,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verificationToken) {
        return { success: false, error: 'Invalid or expired token' };
      }

      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: verificationToken.email },
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Update user
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      // Mark token as used
      await this.prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true },
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          isEmailVerified: true,
        },
      };
    } catch (error: any) {
      logger.error('Email verification error', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // Always return success to prevent user enumeration
      if (!user) {
        return { success: true };
      }

      // Generate reset token
      const resetToken = generateVerificationToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: expiresAt,
        },
      });

      // Send reset email
      await sendPasswordResetEmail(email, resetToken);

      return { success: true };
    } catch (error: any) {
      logger.error('Password reset request error', error);
      return { success: false, error: 'Failed to process request' };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      // Validate password
      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Find user with valid token
      const user = await this.prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return { success: false, error: 'Invalid or expired token' };
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          hashedPassword: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      // Invalidate all refresh tokens for security
      await this.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      return { success: true };
    } catch (error: any) {
      logger.error('Password reset error', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  /**
   * Set username
   */
  async setUsername(userId: string, username: string): Promise<AuthResult> {
    try {
      // Validate username
      if (!username || username.length < 3 || username.length > 20) {
        return { success: false, error: 'Username must be between 3 and 20 characters' };
      }

      // Check if username is taken
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return { success: false, error: 'Username already taken' };
      }

      // Update user
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error: any) {
      logger.error('Set username error', error);
      return { success: false, error: 'Failed to set username' };
    }
  }
}

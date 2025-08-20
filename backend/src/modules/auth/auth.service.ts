import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { isInstitutionalEmail, validatePasswordStrength } from './utils/validation.utils';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    career?: string;
    semester?: number;
    isEmailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, career, semester, interests } = registerDto;

    // Validar email institucional
    if (!isInstitutionalEmail(email)) {
      throw new BadRequestException('Debe usar un correo institucional (@ciencias.unam.mx)');
    }

    // Validar fortaleza de contraseña
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.errors.join(', '));
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        hashedPassword,
        career,
        semester,
        interests: interests || [],
        isEmailVerified: false, // En el MVP podemos omitir verificación por email
      },
    });

    // Generar tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        career: user.career,
        semester: user.semester,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Validar email institucional
    if (!isInstitutionalEmail(email)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    // Actualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generar tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        career: user.career,
        semester: user.semester,
        isEmailVerified: user.isEmailVerified,
      },
      ...tokens
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken
      }
    });
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de renovación inválido');
    }

    // Eliminar el token usado
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id }
    });

    // Generar nuevos tokens
    return this.generateTokens(tokenRecord.user);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h'
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d'
    });

    // Guardar refresh token en la base de datos
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    });

    return { accessToken, refreshToken };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        career: true,
        interests: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(userData: any) {
    return this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        career: true,
        interests: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, userData: any) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        career: true,
        interests: true,
        updatedAt: true,
      },
    });
  }
}

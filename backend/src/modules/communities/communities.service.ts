import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

export interface FindAllCommunitiesOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createCommunityDto: CreateCommunityDto) {
    return this.prisma.community.create({
      data: {
        ...createCommunityDto,
        isApproved: false, // Por defecto requiere aprobación
      }
    });
  }

  async findAll(options: FindAllCommunitiesOptions) {
    const { search, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      isApproved: true, // Solo comunidades aprobadas
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [communities, total] = await Promise.all([
      this.prisma.community.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc'
        }
      }),
      this.prisma.community.count({ where })
    ]);

    return {
      data: communities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findPending() {
    return this.prisma.community.findMany({
      where: {
        isApproved: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id }
    });

    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }

    return community;
  }

  async update(id: string, updateCommunityDto: UpdateCommunityDto) {
    const community = await this.prisma.community.findUnique({
      where: { id }
    });

    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }

    return this.prisma.community.update({
      where: { id },
      data: updateCommunityDto
    });
  }

  async approve(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id }
    });

    if (!community) {
      throw new NotFoundException('Comunidad no encontrada');
    }

    return this.prisma.community.update({
      where: { id },
      data: { isApproved: true }
    });
  }

  async getDirectory() {
    return this.prisma.community.findMany({
      where: {
        isApproved: true
      },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        responsible: true,
        email: true,
        website: true,
        socialLinks: true
      }
    });
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementCategory, AnnouncementStatus } from '@prisma/client';

export interface FindAllOptions {
  category?: AnnouncementCategory;
  page: number;
  limit: number;
}

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, authorId: string) {
    return this.prisma.announcement.create({
      data: {
        ...createAnnouncementDto,
        authorId,
        status: AnnouncementStatus.PUBLISHED,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            career: true,
          }
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          }
        }
      }
    });
  }

  async findAll(options: FindAllOptions) {
    const { category, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      status: AnnouncementStatus.PUBLISHED,
    };

    if (category) {
      where.category = category;
    }

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              career: true,
            }
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
            }
          }
        }
      }),
      this.prisma.announcement.count({ where })
    ]);

    return {
      data: announcements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            career: true,
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          }
        }
      }
    });

    if (!announcement) {
      throw new NotFoundException('Anuncio no encontrado');
    }

    return announcement;
  }

  async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto, userId: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Anuncio no encontrado');
    }

    if (announcement.authorId !== userId) {
      throw new ForbiddenException('No tienes permisos para editar este anuncio');
    }

    return this.prisma.announcement.update({
      where: { id },
      data: updateAnnouncementDto,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            career: true,
          }
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          }
        }
      }
    });
  }

  async remove(id: string, userId: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundException('Anuncio no encontrado');
    }

    if (announcement.authorId !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este anuncio');
    }

    await this.prisma.announcement.delete({
      where: { id }
    });

    return { message: 'Anuncio eliminado exitosamente' };
  }

  async toggleLike(announcementId: string, userId: string) {
    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        userId_announcementId: {
          userId,
          announcementId
        }
      }
    });

    if (existingReaction) {
      // Remove like
      await this.prisma.reaction.delete({
        where: {
          userId_announcementId: {
            userId,
            announcementId
          }
        }
      });
      return { message: 'Like removido', liked: false };
    } else {
      // Add like
      await this.prisma.reaction.create({
        data: {
          type: 'like',
          userId,
          announcementId
        }
      });
      return { message: 'Like agregado', liked: true };
    }
  }

  async findByUser(userId: string) {
    return this.prisma.announcement.findMany({
      where: {
        authorId: userId,
        status: AnnouncementStatus.PUBLISHED,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            career: true,
          }
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          }
        }
      }
    });
  }
}

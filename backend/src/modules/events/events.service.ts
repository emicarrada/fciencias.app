import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export interface FindAllEventsOptions {
  startDate?: Date;
  endDate?: Date;
  isVirtual?: boolean;
  page: number;
  limit: number;
}

export interface CalendarOptions {
  month: number;
  year: number;
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, organizerId: string) {
    // Obtener información del organizador
    const organizer = await this.prisma.user.findUnique({
      where: { id: organizerId },
      select: { firstName: true, lastName: true }
    });

    return this.prisma.event.create({
      data: {
        ...createEventDto,
        organizer: `${organizer.firstName} ${organizer.lastName}`,
      }
    });
  }

  async findAll(options: FindAllEventsOptions) {
    const { startDate, endDate, isVirtual, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublic: true,
    };

    // Filtros de fecha
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) {
        where.startDate.gte = startDate;
      }
      if (endDate) {
        where.startDate.lte = endDate;
      }
    }

    // Filtro de modalidad
    if (isVirtual !== undefined) {
      where.isVirtual = isVirtual;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: 'asc'
        }
      }),
      this.prisma.event.count({ where })
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getCalendarEvents(options: CalendarOptions) {
    const { month, year } = options;
    
    // Calcular fechas de inicio y fin del mes
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        location: true,
        isVirtual: true,
        organizer: true
      }
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Verificar que el usuario sea el organizador (por ahora, simplificado)
    // En una implementación completa, tendrías que verificar contra una tabla de organizadores
    
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto
    });
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Verificar permisos de eliminación
    // En una implementación completa, verificarías roles/permisos

    await this.prisma.event.delete({
      where: { id }
    });

    return { message: 'Evento eliminado exitosamente' };
  }

  async getUpcomingEvents() {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    return this.prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: {
          gte: now,
          lte: nextWeek
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      take: 5 // Limitamos a los próximos 5 eventos
    });
  }
}

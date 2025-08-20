import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de eventos con filtros opcionales' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'isVirtual', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de eventos obtenida exitosamente' })
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('isVirtual') isVirtual?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.eventsService.findAll({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isVirtual: isVirtual ? isVirtual === 'true' : undefined,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Obtener eventos para el calendario' })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Eventos del calendario obtenidos exitosamente' })
  async getCalendarEvents(
    @Query('month') month?: string,
    @Query('year') year?: string
  ) {
    const currentDate = new Date();
    return this.eventsService.getCalendarEvents({
      month: month ? parseInt(month) : currentDate.getMonth() + 1,
      year: year ? parseInt(year) : currentDate.getFullYear()
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento específico por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un evento existente' })
  @ApiResponse({ status: 200, description: 'Evento actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para editar este evento' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un evento' })
  @ApiResponse({ status: 200, description: 'Evento eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para eliminar este evento' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.user.id);
  }

  @Get('upcoming/next-week')
  @ApiOperation({ summary: 'Obtener eventos de la próxima semana' })
  @ApiResponse({ status: 200, description: 'Eventos próximos obtenidos exitosamente' })
  async getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }
}

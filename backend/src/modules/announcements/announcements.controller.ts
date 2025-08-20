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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnnouncementCategory } from '@prisma/client';

@ApiTags('announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo anuncio' })
  @ApiResponse({ status: 201, description: 'Anuncio creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Req() req: any) {
    return this.announcementsService.create(createAnnouncementDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de anuncios con filtros opcionales' })
  @ApiQuery({ name: 'category', required: false, enum: AnnouncementCategory })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de anuncios obtenida exitosamente' })
  async findAll(
    @Query('category') category?: AnnouncementCategory,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.announcementsService.findAll({
      category,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un anuncio específico por ID' })
  @ApiResponse({ status: 200, description: 'Anuncio encontrado' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un anuncio existente' })
  @ApiResponse({ status: 200, description: 'Anuncio actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para editar este anuncio' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @Req() req: any
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un anuncio' })
  @ApiResponse({ status: 200, description: 'Anuncio eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para eliminar este anuncio' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.announcementsService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Dar like a un anuncio' })
  @ApiResponse({ status: 200, description: 'Like agregado exitosamente' })
  async like(@Param('id') id: string, @Req() req: any) {
    return this.announcementsService.toggleLike(id, req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener anuncios de un usuario específico' })
  @ApiResponse({ status: 200, description: 'Anuncios del usuario obtenidos exitosamente' })
  async findByUser(@Param('userId') userId: string) {
    return this.announcementsService.findByUser(userId);
  }
}

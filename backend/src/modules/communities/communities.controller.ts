import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('communities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva comunidad (requiere aprobación)' })
  @ApiResponse({ status: 201, description: 'Comunidad creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communitiesService.create(createCommunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de comunidades aprobadas' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de comunidades obtenida exitosamente' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.communitiesService.findAll({
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Obtener comunidades pendientes de aprobación (admin)' })
  @ApiResponse({ status: 200, description: 'Lista de comunidades pendientes' })
  async findPending() {
    return this.communitiesService.findPending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una comunidad específica por ID' })
  @ApiResponse({ status: 200, description: 'Comunidad encontrada' })
  @ApiResponse({ status: 404, description: 'Comunidad no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una comunidad existente' })
  @ApiResponse({ status: 200, description: 'Comunidad actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Comunidad no encontrada' })
  async update(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    return this.communitiesService.update(id, updateCommunityDto);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Aprobar una comunidad (admin)' })
  @ApiResponse({ status: 200, description: 'Comunidad aprobada exitosamente' })
  @ApiResponse({ status: 404, description: 'Comunidad no encontrada' })
  async approve(@Param('id') id: string) {
    return this.communitiesService.approve(id);
  }

  @Get('directory/all')
  @ApiOperation({ summary: 'Obtener directorio completo de comunidades aprobadas' })
  @ApiResponse({ status: 200, description: 'Directorio de comunidades obtenido exitosamente' })
  async getDirectory() {
    return this.communitiesService.getDirectory();
  }
}

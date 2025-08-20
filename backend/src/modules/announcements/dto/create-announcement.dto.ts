import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnouncementCategory } from '@prisma/client';

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Título del anuncio',
    minLength: 5,
    maxLength: 200,
    example: 'Nuevo curso de programación avanzada'
  })
  @IsString({ message: 'El título es requerido' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Contenido del anuncio',
    minLength: 10,
    maxLength: 5000,
    example: 'Se abre convocatoria para el nuevo curso de programación avanzada...'
  })
  @IsString({ message: 'El contenido es requerido' })
  @MinLength(10, { message: 'El contenido debe tener al menos 10 caracteres' })
  @MaxLength(5000, { message: 'El contenido no puede exceder 5000 caracteres' })
  content: string;

  @ApiProperty({
    description: 'Categoría del anuncio',
    enum: AnnouncementCategory,
    example: AnnouncementCategory.EVENTOS
  })
  @IsEnum(AnnouncementCategory, { message: 'Categoría inválida' })
  category: AnnouncementCategory;

  @ApiPropertyOptional({
    description: 'Tags asociados al anuncio',
    type: [String],
    example: ['programación', 'curso', 'ciencias computación']
  })
  @IsOptional()
  @IsArray({ message: 'Los tags deben ser un array' })
  @IsString({ each: true, message: 'Cada tag debe ser un string' })
  @MaxLength(30, { each: true, message: 'Cada tag no puede exceder 30 caracteres' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Si el anuncio es público o solo para miembros',
    default: true,
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic debe ser un boolean' })
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Si el anuncio debe estar fijado',
    default: false,
    example: false
  })
  @IsOptional()
  @IsBoolean({ message: 'isPinned debe ser un boolean' })
  isPinned?: boolean;
}

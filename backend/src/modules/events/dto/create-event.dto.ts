import { IsString, IsDateString, IsOptional, IsBoolean, IsInt, IsUrl, MinLength, MaxLength, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    description: 'Título del evento',
    minLength: 5,
    maxLength: 200,
    example: 'Conferencia sobre Inteligencia Artificial'
  })
  @IsString({ message: 'El título es requerido' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descripción del evento',
    minLength: 10,
    maxLength: 2000,
    example: 'Una conferencia magistral sobre los últimos avances en inteligencia artificial aplicada a la investigación científica.'
  })
  @IsString({ message: 'La descripción es requerida' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio del evento',
    example: '2025-09-15T14:00:00.000Z'
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida' })
  startDate: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de fin del evento',
    example: '2025-09-15T16:00:00.000Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser válida' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Ubicación del evento (si es presencial)',
    maxLength: 200,
    example: 'Auditorio José Vasconcelos, Facultad de Ciencias'
  })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  @MaxLength(200, { message: 'La ubicación no puede exceder 200 caracteres' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Si el evento es virtual',
    default: false,
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isVirtual debe ser un boolean' })
  isVirtual?: boolean;

  @ApiPropertyOptional({
    description: 'URL de la reunión virtual (si aplica)',
    example: 'https://meet.google.com/abc-defg-hij'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  meetingUrl?: string;

  @ApiPropertyOptional({
    description: 'Número máximo de asistentes',
    minimum: 1,
    example: 50
  })
  @IsOptional()
  @IsInt({ message: 'El máximo de asistentes debe ser un número entero' })
  @Min(1, { message: 'Debe permitir al menos 1 asistente' })
  @Type(() => Number)
  maxAttendees?: number;

  @ApiPropertyOptional({
    description: 'Tags asociados al evento',
    type: [String],
    example: ['conferencia', 'IA', 'investigación']
  })
  @IsOptional()
  @IsArray({ message: 'Los tags deben ser un array' })
  @IsString({ each: true, message: 'Cada tag debe ser un string' })
  @MaxLength(30, { each: true, message: 'Cada tag no puede exceder 30 caracteres' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Si el evento es público',
    default: true,
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic debe ser un boolean' })
  isPublic?: boolean;
}

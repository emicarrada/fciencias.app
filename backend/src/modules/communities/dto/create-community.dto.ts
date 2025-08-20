import { IsString, IsEmail, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityDto {
  @ApiProperty({
    description: 'Nombre de la comunidad',
    minLength: 3,
    maxLength: 100,
    example: 'Grupo de Inteligencia Artificial'
  })
  @IsString({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción de la comunidad',
    minLength: 10,
    maxLength: 500,
    example: 'Comunidad dedicada al estudio y desarrollo de técnicas de inteligencia artificial en la Facultad de Ciencias.'
  })
  @IsString({ message: 'La descripción es requerida' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Nombre del responsable de la comunidad',
    minLength: 2,
    maxLength: 100,
    example: 'Dr. María González'
  })
  @IsString({ message: 'El responsable es requerido' })
  @MinLength(2, { message: 'El nombre del responsable debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del responsable no puede exceder 100 caracteres' })
  responsible: string;

  @ApiProperty({
    description: 'Email de contacto de la comunidad',
    example: 'ia@ciencias.unam.mx'
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Sitio web de la comunidad',
    example: 'https://ia.ciencias.unam.mx'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Enlaces a redes sociales y otros recursos',
    example: {
      facebook: 'https://facebook.com/iaciencias',
      twitter: 'https://twitter.com/iaciencias',
      discord: 'https://discord.gg/iaciencias'
    }
  })
  @IsOptional()
  socialLinks?: any;
}

import { IsEmail, IsString, IsOptional, IsEnum, IsInt, MinLength, MaxLength, Matches, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Career } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@ciencias\.unam\.mx$/, {
    message: 'Debe ser un correo institucional (@ciencias.unam.mx)'
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'El nombre de usuario no puede exceder 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números y guiones bajos'
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  username?: string;

  @IsOptional()
  @IsString({ message: 'El color del avatar debe ser un texto' })
  @Matches(/^(blue|green|red|purple|orange|pink|yellow|indigo|gray)$/, {
    message: 'Color de avatar no válido'
  })
  avatarColor?: string;

  @IsOptional()
  @IsEnum(Career, { message: 'Carrera no válida' })
  career?: Career;

  @IsOptional()
  @IsInt({ message: 'El semestre debe ser un número entero' })
  @Min(1, { message: 'El semestre debe ser mayor a 0' })
  @Max(15, { message: 'El semestre no puede ser mayor a 15' })
  semester?: number;

  @IsOptional()
  @IsString({ each: true })
  @MaxLength(30, { each: true, message: 'Cada interés no puede exceder 30 caracteres' })
  interests?: string[];
}

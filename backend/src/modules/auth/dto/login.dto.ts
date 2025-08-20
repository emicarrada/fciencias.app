import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@ciencias\.unam\.mx$/, {
    message: 'Debe ser un correo institucional (@ciencias.unam.mx)'
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(1, { message: 'La contraseña no puede estar vacía' })
  password: string;
}

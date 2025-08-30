// Tipos para autenticación
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  career: Career;
  semester?: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  career: Career;
  semester?: number;
}

export enum Career {
  ACTUARIA = 'ACTUARIA',
  BIOLOGIA = 'BIOLOGIA',
  CIENCIAS_COMPUTACION = 'CIENCIAS_COMPUTACION',
  CIENCIAS_TIERRA = 'CIENCIAS_TIERRA',
  FISICA = 'FISICA',
  MATEMATICAS = 'MATEMATICAS',
  MATEMATICAS_APLICADAS = 'MATEMATICAS_APLICADAS',
  OTRO = 'OTRO'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export const CAREER_LABELS: Record<Career, string> = {
  [Career.ACTUARIA]: 'Actuaría',
  [Career.BIOLOGIA]: 'Biología',
  [Career.CIENCIAS_COMPUTACION]: 'Ciencias de la Computación',
  [Career.CIENCIAS_TIERRA]: 'Ciencias de la Tierra',
  [Career.FISICA]: 'Física',
  [Career.MATEMATICAS]: 'Matemáticas',
  [Career.MATEMATICAS_APLICADAS]: 'Matemáticas Aplicadas',
  [Career.OTRO]: 'Otro'
};

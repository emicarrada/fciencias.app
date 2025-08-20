/**
 * Valida si un email pertenece al dominio institucional de Ciencias UNAM
 */
export function isInstitutionalEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@ciencias\.unam\.mx$/;
  return emailRegex.test(email);
}

/**
 * Extrae el nombre de usuario del email institucional
 */
export function extractUsernameFromEmail(email: string): string {
  if (!isInstitutionalEmail(email)) {
    throw new Error('Email no institucional');
  }
  return email.split('@')[0];
}

/**
 * Valida la fortaleza de la contraseña
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Carreras disponibles en la Facultad de Ciencias
 */
export const CAREERS_INFO = {
  ACTUARIA: {
    name: 'Actuaría',
    code: 'ACT'
  },
  BIOLOGIA: {
    name: 'Biología',
    code: 'BIO'
  },
  CIENCIAS_COMPUTACION: {
    name: 'Ciencias de la Computación',
    code: 'CC'
  },
  CIENCIAS_TIERRA: {
    name: 'Ciencias de la Tierra',
    code: 'CT'
  },
  FISICA: {
    name: 'Física',
    code: 'FIS'
  },
  MATEMATICAS: {
    name: 'Matemáticas',
    code: 'MAT'
  },
  MATEMATICAS_APLICADAS: {
    name: 'Matemáticas Aplicadas',
    code: 'MAP'
  },
  OTRO: {
    name: 'Otro',
    code: 'OTR'
  }
};

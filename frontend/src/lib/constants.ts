// Constantes de validación y configuración
export const VALIDATION = {
  // Posts
  POST_MAX_LENGTH: 5000,
  POST_MIN_LENGTH: 1,
  
  // Username
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]{3,20}$/,
  
  // Password
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Tokens
  TOKEN_EXPIRY: {
    ACCESS_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 días
    REFRESH_TOKEN: 30 * 24 * 60 * 60 * 1000, // 30 días
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 horas
    PASSWORD_RESET: 60 * 60 * 1000, // 1 hora
  },
  
  // Rate limiting (para futuro)
  RATE_LIMITS: {
    RESEND_EMAIL: 0, // Sin límite por ahora
    LOGIN_ATTEMPTS: 5,
    POSTS_PER_HOUR: 10,
  },
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    SET_USERNAME: '/api/v1/auth/set-username',
    DEV_VERIFY: '/api/v1/auth/dev-verify', // Solo desarrollo
  },
  POSTS: {
    CREATE: '/api/v1/posts/create',
    FEED: '/api/v1/posts/feed',
    BY_ID: (id: string) => `/api/v1/posts/${id}`,
    BY_USER: (userId: string) => `/api/v1/posts/user/${userId}`,
  },
} as const;

export const UI_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Bienvenido de vuelta',
    REGISTER_SUCCESS: '¡Cuenta creada exitosamente!',
    LOGOUT_SUCCESS: 'Sesión cerrada',
    EMAIL_VERIFIED: 'Email verificado exitosamente',
    PASSWORD_RESET_SENT: 'Correo de recuperación enviado',
    PASSWORD_RESET_SUCCESS: 'Contraseña actualizada exitosamente',
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    EMAIL_ALREADY_EXISTS: 'Este email ya está en uso',
    WEAK_PASSWORD: 'La contraseña es muy débil',
  },
  POSTS: {
    CREATE_SUCCESS: '¡Post publicado!',
    CREATE_ERROR: 'Error al publicar',
    LOAD_ERROR: 'Error al cargar posts',
    EMPTY_FEED: 'No hay publicaciones aún',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`,
    USERNAME_INVALID: 'Nombre de usuario inválido (3-20 caracteres, solo letras, números, _ y -)',
    POST_TOO_LONG: `El post no puede exceder ${VALIDATION.POST_MAX_LENGTH} caracteres`,
  },
} as const;

export const ERROR_CODES = {
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USERNAME_REQUIRED: 'USERNAME_REQUIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

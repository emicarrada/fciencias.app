/**
 * Sistema de permisos progresivos para fciencias.app
 * 
 * Filosofía: "Primero curiosidad, luego confianza, después compromiso"
 * 
 * Los usuarios pueden explorar libremente, pero necesitan verificación
 * progresiva para interactuar según el nivel de exposición.
 */

/**
 * Tipos de interacciones que un usuario puede realizar
 * Cada una requiere diferentes niveles de verificación
 */
export enum InteractionType {
  // Nivel 0: Sin restricciones
  VIEW_FEED = 'VIEW_FEED',
  VIEW_PROFILE = 'VIEW_PROFILE',
  VIEW_POST = 'VIEW_POST',
  VIEW_STORE = 'VIEW_STORE',
  VIEW_REVIEWS = 'VIEW_REVIEWS',
  
  // Nivel 1: Requiere email verificado
  PUBLISH_ANONYMOUS = 'PUBLISH_ANONYMOUS',
  
  // Nivel 2: Requiere email verificado + username
  PUBLISH_POST = 'PUBLISH_POST',
  COMMENT = 'COMMENT',
  SEND_MESSAGE = 'SEND_MESSAGE',
  CREATE_REVIEW = 'CREATE_REVIEW',
  PUBLISH_STORE_ITEM = 'PUBLISH_STORE_ITEM',
  REACT = 'REACT',
}

/**
 * Estados de verificación del usuario
 */
export enum VerificationState {
  NOT_VERIFIED = 'NOT_VERIFIED',       // Email sin verificar
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',   // Email verificado, sin username
  FULLY_VERIFIED = 'FULLY_VERIFIED',   // Email verificado + username configurado
}

/**
 * Resultado de una verificación de permisos
 * Usa el patrón Result para manejo explícito de errores
 */
export interface PermissionCheckResult {
  allowed: boolean;
  requiresEmailVerification: boolean;
  requiresUsername: boolean;
  message?: string; // Mensaje amigable para mostrar al usuario
}

/**
 * Información del estado de verificación del usuario
 * Single Responsibility: Solo contiene datos, no lógica
 */
export interface UserVerificationStatus {
  isEmailVerified: boolean;
  hasUsername: boolean;
  verificationState: VerificationState;
  email: string;
  username?: string;
}

/**
 * Configuración para validar una acción específica
 */
export interface ActionRequirements {
  interactionType: InteractionType;
  isAnonymous?: boolean; // Para publicaciones anónimas
  context?: Record<string, any>; // Contexto adicional
}

/**
 * Mapeo de requisitos por tipo de interacción
 * Define qué necesita cada acción
 */
export const INTERACTION_REQUIREMENTS: Record<
  InteractionType,
  { needsEmail: boolean; needsUsername: boolean; description: string }
> = {
  // Nivel 0: Exploración libre
  [InteractionType.VIEW_FEED]: {
    needsEmail: false,
    needsUsername: false,
    description: 'Ver el feed de publicaciones',
  },
  [InteractionType.VIEW_PROFILE]: {
    needsEmail: false,
    needsUsername: false,
    description: 'Ver perfiles de otros usuarios',
  },
  [InteractionType.VIEW_POST]: {
    needsEmail: false,
    needsUsername: false,
    description: 'Ver publicaciones completas',
  },
  [InteractionType.VIEW_STORE]: {
    needsEmail: false,
    needsUsername: false,
    description: 'Ver productos en la tienda',
  },
  [InteractionType.VIEW_REVIEWS]: {
    needsEmail: false,
    needsUsername: false,
    description: 'Ver reseñas de profesores',
  },
  
  // Nivel 1: Solo email verificado
  [InteractionType.PUBLISH_ANONYMOUS]: {
    needsEmail: true,
    needsUsername: false,
    description: 'Publicar de forma anónima',
  },
  
  // Nivel 2: Email + Username
  [InteractionType.PUBLISH_POST]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Crear una publicación',
  },
  [InteractionType.COMMENT]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Comentar en publicaciones',
  },
  [InteractionType.SEND_MESSAGE]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Enviar mensajes directos',
  },
  [InteractionType.CREATE_REVIEW]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Reseñar profesores',
  },
  [InteractionType.PUBLISH_STORE_ITEM]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Publicar productos en la tienda',
  },
  [InteractionType.REACT]: {
    needsEmail: true,
    needsUsername: true,
    description: 'Reaccionar a publicaciones',
  },
};

/**
 * Mensajes amigables para mostrar al usuario
 * Copy positivo, nunca punitivo
 */
export const VERIFICATION_MESSAGES = {
  EMAIL_REQUIRED: {
    title: 'Verifica tu correo',
    description: 'Para realizar esta acción, verifica tu correo. Esto ayuda a mantener fciencias.app segura.',
    action: 'Enviar correo de verificación',
  },
  USERNAME_REQUIRED: {
    title: 'Elige un nombre de usuario',
    description: 'Puedes cambiarlo después si quieres.',
    action: 'Elegir username',
  },
  ANONYMOUS_OPTION: {
    title: '¿Publicar de forma anónima?',
    description: 'Tu identidad permanecerá oculta para la comunidad.',
    action: 'Publicar anónimamente',
  },
} as const;

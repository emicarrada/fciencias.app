/**
 * useUserPermissions Hook
 * 
 * Hook para gestionar permisos de usuario basados en verificación progresiva.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo valida permisos
 * - Dependency Inversion: Depende de abstracciones (tipos)
 * - Open/Closed: Extensible sin modificar
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  InteractionType,
  VerificationState,
  PermissionCheckResult,
  UserVerificationStatus,
  ActionRequirements,
  INTERACTION_REQUIREMENTS,
  VERIFICATION_MESSAGES,
} from '@/types/permissions';

/**
 * Hook principal para verificación de permisos
 * 
 * @returns Funciones y estado para validar permisos de usuario
 */
export const useUserPermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  /**
   * Obtiene el estado actual de verificación del usuario
   * Memoizado para evitar recalcular en cada render
   */
  const verificationStatus: UserVerificationStatus = useMemo(() => {
    if (!user || !isAuthenticated) {
      return {
        isEmailVerified: false,
        hasUsername: false,
        verificationState: VerificationState.NOT_VERIFIED,
        email: '',
      };
    }

    const hasUsername = Boolean(user.username && user.username.length > 0);
    const isEmailVerified = user.isEmailVerified || false;

    let verificationState: VerificationState;
    
    if (!isEmailVerified) {
      verificationState = VerificationState.NOT_VERIFIED;
    } else if (isEmailVerified && !hasUsername) {
      verificationState = VerificationState.EMAIL_VERIFIED;
    } else {
      verificationState = VerificationState.FULLY_VERIFIED;
    }

    return {
      isEmailVerified,
      hasUsername,
      verificationState,
      email: user.email,
      username: user.username,
    };
  }, [user, isAuthenticated]);

  /**
   * Verifica si el usuario puede ver el feed
   * Siempre retorna true - acceso libre
   */
  const canViewFeed = useCallback((): boolean => {
    return true; // Acceso sin restricciones
  }, []);

  /**
   * Verifica permisos para una acción específica
   * 
   * @param requirements - Configuración de la acción a validar
   * @returns Resultado detallado de la validación
   */
  const checkPermission = useCallback(
    (requirements: ActionRequirements): PermissionCheckResult => {
      const { interactionType, isAnonymous = false } = requirements;
      
      // Obtener requisitos de la acción
      const actionRequirements = INTERACTION_REQUIREMENTS[interactionType];
      
      if (!actionRequirements) {
        return {
          allowed: false,
          requiresEmailVerification: false,
          requiresUsername: false,
          message: 'Acción no reconocida',
        };
      }

      // Acciones de visualización: siempre permitidas
      if (!actionRequirements.needsEmail && !actionRequirements.needsUsername) {
        return {
          allowed: true,
          requiresEmailVerification: false,
          requiresUsername: false,
        };
      }

      // Usuario no autenticado
      if (!isAuthenticated || !user) {
        return {
          allowed: false,
          requiresEmailVerification: false,
          requiresUsername: false,
          message: 'Debes iniciar sesión para realizar esta acción',
        };
      }

      // Verificar email si es requerido
      if (actionRequirements.needsEmail && !verificationStatus.isEmailVerified) {
        return {
          allowed: false,
          requiresEmailVerification: true,
          requiresUsername: false,
          message: VERIFICATION_MESSAGES.EMAIL_REQUIRED.description,
        };
      }

      // Para publicaciones anónimas, no se requiere username
      if (isAnonymous && interactionType === InteractionType.PUBLISH_ANONYMOUS) {
        return {
          allowed: verificationStatus.isEmailVerified,
          requiresEmailVerification: !verificationStatus.isEmailVerified,
          requiresUsername: false,
        };
      }

      // Verificar username si es requerido
      if (actionRequirements.needsUsername && !verificationStatus.hasUsername) {
        return {
          allowed: false,
          requiresEmailVerification: false,
          requiresUsername: true,
          message: VERIFICATION_MESSAGES.USERNAME_REQUIRED.description,
        };
      }

      // Todo OK
      return {
        allowed: true,
        requiresEmailVerification: false,
        requiresUsername: false,
      };
    },
    [user, isAuthenticated, verificationStatus]
  );

  /**
   * Verifica si el usuario puede interactuar (forma simplificada)
   * 
   * @param interactionType - Tipo de interacción
   * @param isAnonymous - Si la acción es anónima (opcional)
   * @returns true si puede realizar la acción
   */
  const canInteract = useCallback(
    (interactionType: InteractionType, isAnonymous?: boolean): boolean => {
      const result = checkPermission({ interactionType, isAnonymous });
      return result.allowed;
    },
    [checkPermission]
  );

  /**
   * Determina si se requiere verificación para una acción
   * 
   * @param interactionType - Tipo de interacción
   * @returns true si requiere algún tipo de verificación
   */
  const requiresVerification = useCallback(
    (interactionType: InteractionType): boolean => {
      const requirements = INTERACTION_REQUIREMENTS[interactionType];
      return requirements.needsEmail || requirements.needsUsername;
    },
    []
  );

  /**
   * Determina si se requiere username para una acción
   * Considera si la acción es anónima
   * 
   * @param interactionType - Tipo de interacción
   * @param isAnonymous - Si la acción es anónima
   * @returns true si requiere username
   */
  const requiresUsername = useCallback(
    (interactionType: InteractionType, isAnonymous: boolean = false): boolean => {
      // Las publicaciones anónimas no requieren username
      if (isAnonymous && interactionType === InteractionType.PUBLISH_ANONYMOUS) {
        return false;
      }
      
      const requirements = INTERACTION_REQUIREMENTS[interactionType];
      return requirements.needsUsername;
    },
    []
  );

  /**
   * Obtiene un mensaje amigable para mostrar al usuario
   * 
   * @param result - Resultado de la verificación de permisos
   * @returns Objeto con título, descripción y acción
   */
  const getVerificationMessage = useCallback(
    (result: PermissionCheckResult) => {
      if (result.requiresEmailVerification) {
        return VERIFICATION_MESSAGES.EMAIL_REQUIRED;
      }
      
      if (result.requiresUsername) {
        return VERIFICATION_MESSAGES.USERNAME_REQUIRED;
      }
      
      return null;
    },
    []
  );

  return {
    // Estado
    verificationStatus,
    isAuthenticated,
    user,
    
    // Funciones principales
    canViewFeed,
    canInteract,
    checkPermission,
    requiresVerification,
    requiresUsername,
    getVerificationMessage,
  };
};

/**
 * RequireVerification Component
 * 
 * Componente guard que intercepta acciones y valida permisos según verificación progresiva.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo valida y muestra modales de verificación
 * - Inversion of Control: Usa hooks para lógica de permisos
 * - Open/Closed: Extensible para nuevas interacciones sin modificar
 * 
 * @example
 * ```tsx
 * <RequireVerification
 *   interactionType={InteractionType.COMMENT}
 *   onAllow={() => handleComment()}
 * >
 *   <Button>Comentar</Button>
 * </RequireVerification>
 * ```
 */

'use client';

import { ReactNode, useCallback, useState } from 'react';
import { useUserPermissions } from '@/hooks/business/useUserPermissions';
import { InteractionType } from '@/types/permissions';
import { EmailVerificationModal } from '@/components/ui/EmailVerificationModal';
import { EmailCaptureModal } from '@/components/ui/EmailCaptureModal';
import { useAuthStore } from '@/store/authStore';

interface RequireVerificationProps {
  /** Tipo de interacción a validar */
  interactionType: InteractionType;
  
  /** Callback ejecutado cuando la acción está permitida */
  onAllow: () => void;
  
  /** Si la publicación/interacción es anónima (afecta requisitos) */
  isAnonymous?: boolean;
  
  /** Elemento hijo a renderizar (botón, link, etc) */
  children: ReactNode;
  
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Guard component que intercepta clicks y valida permisos
 * 
 * Flujo:
 * 1. Usuario hace click en children
 * 2. Se intercepta el evento
 * 3. Se valida con useUserPermissions
 * 4. Si está permitido: ejecuta onAllow()
 * 5. Si falta email: muestra modal de verificación de email (FASE 3)
 * 6. Si falta username: muestra modal de selección de username (FASE 4)
 */
export const RequireVerification = ({
  interactionType,
  onAllow,
  isAnonymous = false,
  children,
  className,
}: RequireVerificationProps) => {
  const { checkPermission, verificationStatus } = useUserPermissions();
  const { updateUser } = useAuthStore();
  
  // Estado para controlar modales
  const [showEmailCaptureModal, setShowEmailCaptureModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState<string>('');

  /**
   * Handler que intercepta el click y valida permisos
   */
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevenir acción por defecto
      event.preventDefault();
      event.stopPropagation();

      // Validar permisos
      const permissionResult = checkPermission({
        interactionType,
        isAnonymous,
      });

      // Si está permitido, ejecutar acción
      if (permissionResult.allowed) {
        onAllow();
        return;
      }

      // Si requiere verificación de email, mostrar modal
      if (permissionResult.requiresEmailVerification) {
        // Verificar si el usuario tiene email
        if (!verificationStatus.email) {
          // Si no tiene email, primero capturarlo
          setShowEmailCaptureModal(true);
        } else {
          // Si ya tiene email, mostrar modal de verificación
          setShowEmailModal(true);
        }
        return;
      }

      // Si requiere username, mostrar modal
      if (permissionResult.requiresUsername) {
        setShowUsernameModal(true);
        return;
      }

      // Fallback: mostrar mensaje de error (no debería llegar aquí)
      console.warn('Permiso denegado:', permissionResult.message);
    },
    [interactionType, isAnonymous, checkPermission, onAllow]
  );

  /**
   * Handler cuando se captura el email del usuario
   * Actualiza el store y muestra el modal de verificación
   */
  const handleEmailCaptured = useCallback(
    (email: string) => {
      setCapturedEmail(email);
      updateUser({ email, isEmailVerified: false });
      setShowEmailCaptureModal(false);
      setShowEmailModal(true);
    },
    [updateUser]
  );

  /**
   * Handler cuando se completa la verificación de email
   * Se conectará al modal en FASE 3
   */
  const handleEmailVerified = useCallback(() => {
    setShowEmailModal(false);
    
    // Actualizar estado del usuario
    updateUser({ isEmailVerified: true });
    
    // Volver a validar permisos tras verificar email
    const permissionResult = checkPermission({
      interactionType,
      isAnonymous,
    });

    // Si ya está permitido, ejecutar acción
    if (permissionResult.allowed) {
      onAllow();
    } else if (permissionResult.requiresUsername) {
      // Si ahora necesita username, mostrar ese modal
      setShowUsernameModal(true);
    }
  }, [interactionType, isAnonymous, checkPermission, onAllow, updateUser]);

  /**
   * Handler cuando se completa la selección de username
   * Se conectará al modal en FASE 4
   */
  const handleUsernameSet = useCallback(() => {
    setShowUsernameModal(false);
    
    // Tras establecer username, ejecutar acción
    onAllow();
  }, [onAllow]);

  return (
    <>
      {/* Wrapper que intercepta clicks */}
      <div
        onClick={handleClick}
        className={className}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>

      {/* Modal de captura de email (si no tiene email) */}
      {showEmailCaptureModal && (
        <EmailCaptureModal
          open={showEmailCaptureModal}
          onClose={() => setShowEmailCaptureModal(false)}
          onEmailCaptured={handleEmailCaptured}
        />
      )}

      {/* Modal de verificación de email (funcional) */}
      {showEmailModal && (
        <EmailVerificationModal
          email={capturedEmail || verificationStatus.email}
          open={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onVerified={handleEmailVerified}
        />
      )}

      {/* Modal de selección de username (placeholder - FASE 4) */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Elige un nombre de usuario
            </h3>
            <p className="text-gray-600 mb-4">
              Para realizar esta acción, necesitas elegir un nombre de usuario.
              Podrás cambiarlo después si lo deseas.
            </p>
            <input
              type="text"
              placeholder="nombre_usuario"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUsernameSet}
                className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

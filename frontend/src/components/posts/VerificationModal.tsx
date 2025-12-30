/**
 * Componente: VerificationModal
 * Responsabilidad única: Mostrar modal de verificación de email
 * Extraído de CreatePostForm para seguir SRP
 */

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResendVerification: () => Promise<void>;
  onDevVerify: () => Promise<void>;
}

export default function VerificationModal({
  isOpen,
  onClose,
  onResendVerification,
  onDevVerify,
}: VerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">📧</div>
          <h3 className="text-xl font-bold text-gray-900">Verifica tu correo</h3>
        </div>
        <p className="text-gray-700 mb-2">
          <strong>Tu post está guardado</strong> - no se perderá 💾
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          Para participar en la comunidad, necesitamos verificar tu correo. Esto nos ayuda a mantener un espacio seguro y auténtico para todos.
        </p>
        <div className="flex flex-col gap-3">
          {/* Botón de verificación rápida (solo desarrollo) */}
          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={onDevVerify}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ⚡ Verificar ahora (desarrollo)
            </button>
          )}
          <button
            onClick={onResendVerification}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            📧 Reenviar correo
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente: CreatePostForm
 * Responsabilidad única: Renderizar UI del formulario de creación de posts
 * Refactorizado siguiendo SRP:
 * - Lógica de negocio → useCreatePost hook
 * - Modal de verificación → VerificationModal component
 * - Modal de username → UsernameModal component
 */

'use client';

import { useCreatePost } from '@/hooks/useCreatePost';
import VerificationModal from './VerificationModal';
import UsernameModal from './UsernameModal';

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const {
    content,
    setContent,
    imageUrl,
    setImageUrl,
    isAnonymous,
    setIsAnonymous,
    isSubmitting,
    showVerificationModal,
    setShowVerificationModal,
    showUsernameModal,
    setShowUsernameModal,
    handleSubmit,
    handleResendVerification,
    handleDevVerify,
  } = useCreatePost(onSuccess);

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Crear publicación</h2>
        
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué quieres compartir?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          rows={4}
          disabled={isSubmitting}
          maxLength={5000}
        />
        
        <div className="text-sm text-gray-500 mt-1 mb-4">
          {content.length} / 5000 caracteres
        </div>

        {/* URL de imagen (opcional) */}
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de imagen (opcional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4"
          disabled={isSubmitting}
        />

        {/* Toggle anónimo */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700">Publicar de forma anónima</span>
        </label>

        {/* Botón publicar */}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </button>
      </form>

      {/* Modal: Verificación requerida */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onResendVerification={handleResendVerification}
        onDevVerify={handleDevVerify}
      />

      {/* Modal: Username requerido */}
      <UsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSuccess={() => handleSubmit(new Event('submit') as any)}
      />
    </>
  );
}

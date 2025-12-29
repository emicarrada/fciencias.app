/**
 * Ejemplo de uso de RequireVerification Guard
 * 
 * Este componente muestra cómo usar el guard en diferentes escenarios.
 * Archivo de referencia para desarrolladores.
 */

'use client';

import { RequireVerification } from '@/components/guards';
import { Button } from '@/components/ui/Button';
import { InteractionType } from '@/types/permissions';

export const RequireVerificationExample = () => {
  // Handlers para diferentes acciones
  const handleComment = () => {
    console.log('Comentario permitido - ejecutando acción');
    // Aquí iría la lógica real de comentar
  };

  const handleLike = () => {
    console.log('Reacción permitida - ejecutando acción');
    // Aquí iría la lógica real de dar like/reaccionar
  };

  const handlePublishAnonymous = () => {
    console.log('Publicación anónima permitida - ejecutando acción');
    // Aquí iría la lógica real de publicar anónimamente
  };

  const handlePublishPost = () => {
    console.log('Publicación permitida - ejecutando acción');
    // Aquí iría la lógica real de publicar
  };

  const handleSendDM = () => {
    console.log('DM permitido - ejecutando acción');
    // Aquí iría la lógica real de enviar mensaje
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        Ejemplos de RequireVerification Guard
      </h1>

      {/* Ejemplo 1: Comentar (requiere email verificado) */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">1. Comentar</h2>
        <p className="text-gray-600">
          Requiere: Email verificado
        </p>
        <RequireVerification
          interactionType={InteractionType.COMMENT}
          onAllow={handleComment}
        >
          <Button variant="primary">
            💬 Comentar
          </Button>
        </RequireVerification>
      </section>

      {/* Ejemplo 2: Dar Reacción (requiere email verificado + username) */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">2. Dar Reacción</h2>
        <p className="text-gray-600">
          Requiere: Email verificado + Username
        </p>
        <RequireVerification
          interactionType={InteractionType.REACT}
          onAllow={handleLike}
        >
          <Button variant="ghost">
            ❤️ Me gusta
          </Button>
        </RequireVerification>
      </section>

      {/* Ejemplo 3: Publicar anónimamente (requiere solo email) */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">3. Publicar Anónimamente</h2>
        <p className="text-gray-600">
          Requiere: Email verificado (sin username)
        </p>
        <RequireVerification
          interactionType={InteractionType.PUBLISH_POST}
          isAnonymous={true}
          onAllow={handlePublishAnonymous}
        >
          <Button variant="secondary">
            🕶️ Publicar Anónimo
          </Button>
        </RequireVerification>
      </section>

      {/* Ejemplo 4: Publicar con nombre (requiere email + username) */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">4. Publicar con Nombre</h2>
        <p className="text-gray-600">
          Requiere: Email verificado + Username
        </p>
        <RequireVerification
          interactionType={InteractionType.PUBLISH_POST}
          isAnonymous={false}
          onAllow={handlePublishPost}
        >
          <Button variant="primary">
            📝 Publicar
          </Button>
        </RequireVerification>
      </section>

      {/* Ejemplo 5: Enviar Mensaje (requiere email + username) */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">5. Enviar Mensaje Directo</h2>
        <p className="text-gray-600">
          Requiere: Email verificado + Username
        </p>
        <RequireVerification
          interactionType={InteractionType.SEND_MESSAGE}
          onAllow={handleSendDM}
        >
          <Button variant="outline">
            ✉️ Enviar Mensaje
          </Button>
        </RequireVerification>
      </section>

      {/* Notas técnicas */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-2">
        <h3 className="font-semibold text-blue-900">📌 Notas Técnicas</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
          <li>El guard intercepta clicks automáticamente</li>
          <li>Valida permisos usando useUserPermissions hook</li>
          <li>Muestra modales solo cuando es necesario</li>
          <li>Los modales actuales son placeholders (FASE 3 y 4 los implementarán)</li>
          <li>Tras completar verificación, ejecuta la acción automáticamente</li>
        </ul>
      </section>
    </div>
  );
};

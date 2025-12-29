/**
 * Ejemplo de uso aislado de EmailVerificationModal
 * Permite probar el modal sin integración con el guard.
 */
'use client';
import { useState } from 'react';
import { EmailVerificationModal } from './EmailVerificationModal';

export default function EmailVerificationModalExample() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Demo: EmailVerificationModal</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Correo a verificar"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => setOpen(true)}
          disabled={!email}
          className="px-4 py-2 bg-primary-700 text-white rounded-lg disabled:opacity-50"
        >
          Probar Modal
        </button>
      </div>
      <EmailVerificationModal
        email={email}
        open={open}
        onClose={() => setOpen(false)}
        onVerified={() => alert('¡Correo verificado!')}
      />
      <div className="text-gray-500 text-sm mt-8">
        Puedes usar cualquier correo registrado en la base de datos.<br />
        El modal permite reenviar, verificar y cerrar.
      </div>
    </div>
  );
}

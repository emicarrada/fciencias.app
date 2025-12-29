/**
 * EmailCaptureModal
 * Modal para capturar el email del usuario en verificación progresiva.
 * Principios SOLID: SRP, OCP, ISP, DIP
 */

'use client';

import { useState, useCallback } from 'react';

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onEmailCaptured: (email: string) => void;
  title?: string;
  description?: string;
}

export function EmailCaptureModal({
  open,
  onClose,
  onEmailCaptured,
  title = 'Agrega tu correo electrónico',
  description = 'Para continuar, necesitamos tu correo electrónico. Esto te permitirá recibir notificaciones y recuperar tu cuenta.',
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validación básica de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler para guardar email
  const handleSave = useCallback(async () => {
    setError(null);

    // Validar formato
    if (!email || !isValidEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'No se pudo guardar el correo');
      }

      // Email guardado exitosamente
      onEmailCaptured(email);
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [email, onEmailCaptured]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 mb-4 text-center text-sm">{description}</p>
        
        {error && (
          <div className="bg-red-100 text-red-800 rounded px-3 py-2 mb-3 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={loading || !email}
            className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

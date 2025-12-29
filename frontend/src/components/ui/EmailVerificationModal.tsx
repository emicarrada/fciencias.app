/**
 * EmailVerificationModal
 * Modal funcional para el flujo de verificación de email.
 * Principios SOLID: SRP, OCP, ISP, DIP
 */

'use client';

import { useState, useCallback } from 'react';

interface EmailVerificationModalProps {
  email: string;
  open: boolean;
  onClose: () => void;
  onVerified?: () => void;
  resendLabel?: string;
  verifiedLabel?: string;
  description?: string;
}

export function EmailVerificationModal({
  email,
  open,
  onClose,
  onVerified,
  resendLabel = 'Reenviar correo',
  verifiedLabel = 'Ya verifiqué',
  description = 'Para continuar, verifica tu correo electrónico. Te hemos enviado un enlace de verificación.',
}: EmailVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);

  // Reenviar correo
  const handleResend = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/v1/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('No se pudo enviar el correo.');
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Verificar si ya está verificado
  const handleCheckVerified = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/auth/check-verification-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('No se pudo verificar el estado.');
      const data = await res.json();
      if (data.isEmailVerified) {
        setVerified(true);
        if (onVerified) onVerified();
        onClose();
      } else {
        setError('Aún no has verificado tu correo. Revisa tu bandeja de entrada.');
      }
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setChecking(false);
    }
  }, [email, onVerified, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-xl font-semibold mb-2 text-center">Verifica tu correo electrónico</h3>
        <p className="text-gray-700 mb-2 text-center">
          <span className="font-medium">{email}</span>
        </p>
        <p className="text-gray-600 mb-4 text-center">{description}</p>
        {success && (
          <div className="bg-green-100 text-green-800 rounded px-3 py-2 mb-2 text-sm text-center">
            Correo enviado. Revisa tu bandeja de entrada.
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 rounded px-3 py-2 mb-2 text-sm text-center">
            {error}
          </div>
        )}
        {verified && (
          <div className="bg-blue-100 text-blue-800 rounded px-3 py-2 mb-2 text-sm text-center">
            ¡Correo verificado correctamente!
          </div>
        )}
        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-60"
          >
            {loading ? 'Enviando...' : resendLabel}
          </button>
          <button
            onClick={handleCheckVerified}
            disabled={checking}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {checking ? 'Verificando...' : verifiedLabel}
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

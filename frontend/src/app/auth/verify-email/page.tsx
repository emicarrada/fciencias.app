'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Loader from '@/components/ui/Loader';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    try {
      // Aquí implementaremos la lógica para reenviar el email
      setResendCooldown(60); // 60 segundos de cooldown
      // TODO: Llamar al endpoint de reenvío
    } catch (error) {
      console.error('Error resending email:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <EnvelopeIcon className="w-12 h-12 text-blue-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Verifica tu correo electrónico
          </h2>
          
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              Hemos enviado un enlace de verificación a:
            </p>
            <p className="text-xl font-semibold text-primary-600 bg-primary-50 py-2 px-4 rounded-lg">
              {email || 'tu correo institucional'}
            </p>
            
            <div className="mt-8 space-y-3">
              <p className="text-sm">
                Haz clic en el enlace del correo para activar tu cuenta y completar el registro.
              </p>
              <p className="text-xs text-gray-500">
                Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-4"
        >
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
              resendCooldown > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            {resendCooldown > 0 
              ? `Reenviar en ${resendCooldown}s` 
              : 'Reenviar correo de verificación'
            }
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-md p-4"
        >
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-semibold">¡Ya casi terminas!</p>
              <p>Una vez verificado tu correo, podrás acceder a todas las funciones de FCiencias.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={48} />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

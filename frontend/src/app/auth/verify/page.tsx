'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';

interface VerificationResult {
  success: boolean;
  message: string;
  user?: any;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = searchParams?.get('token') || null;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setResult({
          success: false,
          message: 'Token de verificación no encontrado'
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/v1/auth/verify?token=${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Guardar tokens de autenticación
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(data.user);
          }

          setResult({
            success: true,
            message: '¡Correo verificado exitosamente! Bienvenido a FCiencias.',
            user: data.user
          });
          
          toast.success('¡Cuenta verificada exitosamente!');
          
          // Redirigir al dashboard después de 3 segundos
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          const error = await response.json();
          setResult({
            success: false,
            message: error.message || 'Error al verificar el correo'
          });
        }
      } catch (error) {
        setResult({
          success: false,
          message: 'Error de conexión. Inténtalo de nuevo.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, router, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} />
          <p className="mt-4 text-gray-600">Verificando tu correo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${
            result?.success 
              ? 'bg-green-100' 
              : 'bg-red-100'
          }`}
        >
          {result?.success ? (
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          ) : (
            <XCircleIcon className="w-12 h-12 text-red-600" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className={`text-3xl font-extrabold mb-4 ${
            result?.success ? 'text-green-900' : 'text-red-900'
          }`}>
            {result?.success ? '¡Verificación Exitosa!' : 'Error de Verificación'}
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            {result?.message}
          </p>

          {result?.success && result.user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
            >
              <h3 className="font-semibold text-green-900 mb-2">
                ¡Bienvenido, {result.user.firstName}!
              </h3>
              <p className="text-sm text-green-700">
                Tu cuenta de FCiencias está lista. Serás redirigido automáticamente al dashboard en unos segundos.
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          {result?.success ? (
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Ir al Dashboard
              </Link>
              <Link
                href="/"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Ir al Inicio
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Intentar de Nuevo
              </Link>
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={48} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

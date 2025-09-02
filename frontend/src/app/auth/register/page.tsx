'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { OnboardingIntegration } from '@/components/onboarding/OnboardingIntegration';
import { OnboardingData } from '@/types/onboarding';
import { Career } from '@/types/auth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Convertir datos del onboarding al formato esperado por el backend
      const registerData = {
        email: data.email,
        password: 'FCiencias2024!', // Password temporal, será reemplazado por verificación de email
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName.split(' ')[0],
        career: data.career as Career,
        semester: 1, // Valor por defecto, se puede personalizar después
      };

      const response = await registerUser(registerData);
      toast.success(response.message);
      router.push('/auth/verify-email?email=' + encodeURIComponent(response.email));
    } catch (error) {
      toast.error('Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 text-white p-3 rounded-full">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Únete a FCiencias
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <OnboardingIntegration
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}

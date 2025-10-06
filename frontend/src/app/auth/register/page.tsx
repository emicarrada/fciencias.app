'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { CompleteOnboarding } from '@/components/onboarding/CompleteOnboarding';
import { Career } from '@/types/auth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();

  const handleOnboardingComplete = async (data: any) => {
    try {
      // Mapear carreras del onboarding al enum del backend
      const careerMapping: Record<string, Career> = {
        'actuaria': Career.ACTUARIA,
        'biologia': Career.BIOLOGIA,
        'computacion': Career.CIENCIAS_COMPUTACION,
        'ciencias-tierra': Career.CIENCIAS_TIERRA,
        'fisica': Career.FISICA,
        'matematicas': Career.MATEMATICAS,
        'matematicas-aplicadas': Career.MATEMATICAS_APLICADAS,
        
      };
      
      // Convertir datos del onboarding al formato esperado por el backend
      const registerData = {
        email: data.email,
        password: data.password, // Usar la contraseña que eligió el usuario
        firstName: data.fullName ? data.fullName.split(' ')[0] : 'Usuario',
        lastName: data.fullName ? data.fullName.split(' ').slice(1).join(' ') || data.fullName.split(' ')[0] : 'Nuevo',
        career: careerMapping[data.career] || Career.CIENCIAS_COMPUTACION,
      };

      const response = await registerUser(registerData);
      toast.success('¡Cuenta creada exitosamente! 🎉');
      router.push('/auth/verify-email?email=' + encodeURIComponent(response.email));
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear la cuenta';
      toast.error(errorMessage);
    }
  };

  const handleOnboardingCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <CompleteOnboarding
        onComplete={handleOnboardingComplete}
        onCancel={handleOnboardingCancel}
      />
    </div>
  );
}

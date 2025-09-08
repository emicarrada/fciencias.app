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
      console.log('📝 Datos recibidos del onboarding:', data);
      
      // Mapear carreras del onboarding al enum del backend
      const careerMapping: Record<string, Career> = {
        'actuaria': Career.ACTUARIA,
        'biologia': Career.BIOLOGIA,
        'computacion': Career.CIENCIAS_COMPUTACION,
        'ciencias-tierra': Career.CIENCIAS_TIERRA,
        'fisica': Career.FISICA,
        'matematicas': Career.MATEMATICAS,
        'matematicas-aplicadas': Career.MATEMATICAS_APLICADAS,
        'quimica': Career.BIOLOGIA, // Por ahora mapear a biología hasta agregar QUIMICA
      };
      
      // Convertir datos del onboarding al formato esperado por el backend
      const registerData = {
        email: data.email,
        password: 'FCiencias2024!', // Password temporal, será reemplazado por verificación de email
        firstName: data.fullName ? data.fullName.split(' ')[0] : 'Usuario',
        lastName: data.fullName ? data.fullName.split(' ').slice(1).join(' ') || data.fullName.split(' ')[0] : 'Nuevo',
        career: careerMapping[data.career] || Career.CIENCIAS_COMPUTACION,
      };
      
      console.log('🚀 Datos para enviar al backend:', registerData);

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
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
      <CompleteOnboarding
        onComplete={handleOnboardingComplete}
        onCancel={handleOnboardingCancel}
      />
    </div>
  );
}

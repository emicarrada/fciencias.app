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
      // Convertir datos del onboarding al formato esperado por el backend
      const registerData = {
        email: data.email,
        password: 'FCiencias2024!', // Password temporal, será reemplazado por verificación de email
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName.split(' ')[0],
        career: data.career as Career,
        semester: 1, // Valor por defecto, se puede personalizar después
        username: data.username,
        avatarColor: data.avatarColor,
      };

      const response = await registerUser(registerData);
      toast.success('¡Cuenta creada exitosamente! 🎉');
      router.push('/auth/verify-email?email=' + encodeURIComponent(response.email));
    } catch (error) {
      toast.error('Error al crear la cuenta');
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

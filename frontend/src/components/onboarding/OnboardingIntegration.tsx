'use client';

import { useState } from 'react';
import { CompleteOnboarding } from '@/components/onboarding/CompleteOnboarding';
import { OnboardingData } from '@/types/onboarding';

interface OnboardingIntegrationProps {
  onComplete: (userData: OnboardingData) => void;
  onCancel: () => void;
  fallbackComponent?: React.ComponentType<any>;
}

/**
 * Componente que integra el nuevo sistema de onboarding
 * Puedes usar este componente para reemplazar el formulario de registro existente
 */
export function OnboardingIntegration({ 
  onComplete, 
  onCancel, 
  fallbackComponent: FallbackComponent 
}: OnboardingIntegrationProps) {
  const [useNewOnboarding, setUseNewOnboarding] = useState(true);

  // Función para convertir datos del onboarding al formato esperado por la API
  const handleOnboardingComplete = async (userData: OnboardingData) => {
    try {
      // Transformar los datos si es necesario para que coincidan con tu API existente
      const transformedData = {
        email: userData.email,
        fullName: userData.fullName,
        username: userData.username,
        password: '', // Se manejaría diferente en producción
        career: userData.career,
        semester: '1', // Valor por defecto, podrías añadir esto al onboarding
        profileData: {
          avatarColor: userData.avatarColor,
        }
      };

      await onComplete(userData);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (useNewOnboarding) {
    return (
      <CompleteOnboarding
        onComplete={handleOnboardingComplete}
        onCancel={onCancel}
      />
    );
  }

  // Si hay un componente fallback (el formulario original), renderizarlo
  if (FallbackComponent) {
    return <FallbackComponent />;
  }

  // Fallback simple
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold text-primary-800 mb-4">
          Sistema de Registro
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => setUseNewOnboarding(true)}
            className="block w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Usar Nuevo Onboarding
          </button>
          <button
            onClick={onCancel}
            className="block w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
}

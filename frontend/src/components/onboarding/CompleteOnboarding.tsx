'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingFlow } from './OnboardingFlow';
import { onboardingSteps, createOnboardingData } from './onboardingConfig';
import { Button } from '@/components/ui/Button';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CompleteOnboardingProps {
  onComplete: (userData: any) => void;
  onCancel: () => void;
}

export function CompleteOnboarding({ onComplete, onCancel }: CompleteOnboardingProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOnboardingComplete = async (formData: Record<string, any>) => {
    setIsCompleting(true);
    
    try {
      // Crear los datos del usuario en el formato esperado
      const userData = createOnboardingData(formData);
      
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Esperar un momento para mostrar el éxito antes de completar
      setTimeout(() => {
        onComplete(userData);
      }, 2000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsCompleting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-20 h-20 text-green-600" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            ¡Bienvenido a FCiencias.app!
          </h2>
          <p className="text-xl font-body text-primary-100 mb-8">
            Tu cuenta ha sido creada exitosamente
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-heading font-semibold text-white mb-2">
            Creando tu cuenta...
          </h3>
          <p className="font-body text-primary-200">
            Esto tomará solo unos segundos
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botón de cancelar */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onCancel}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
      >
        <XMarkIcon className="w-6 h-6 text-white" />
      </motion.button>

      {/* Onboarding Flow */}
      <div className="pt-20">
        <OnboardingFlow
          steps={onboardingSteps}
          onComplete={handleOnboardingComplete}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

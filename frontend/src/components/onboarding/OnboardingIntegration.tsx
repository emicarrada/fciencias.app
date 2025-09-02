'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { Career } from '@/types/auth';

interface OnboardingIntegrationProps {
  onComplete: (data: OnboardingData) => void;
}

interface StepProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  canProceed: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ 
  title, 
  subtitle, 
  children, 
  onNext, 
  onBack, 
  canProceed, 
  isFirst, 
  isLast 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{subtitle}</p>
    </div>
    
    <div className="min-h-[300px]">
      {children}
    </div>
    
    <div className="flex justify-between pt-6">
      {!isFirst && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Atrás
        </button>
      )}
      
      <div className={isFirst ? 'ml-auto' : ''}>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Completar registro' : 'Continuar →'}
        </button>
      </div>
    </div>
  </motion.div>
);

export const OnboardingIntegration: React.FC<OnboardingIntegrationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    career: '' as Career,
    interests: [],
    goals: [],
    experience: '',
    joinReason: ''
  });

  const careers: Career[] = [
    'ACTUARIA',
    'BIOLOGIA',
    'CIENCIAS_COMPUTACION',
    'CIENCIAS_TIERRA',
    'FISICA',
    'MATEMATICAS',
    'MATEMATICAS_APLICADAS'
  ];

  const careerLabels: Record<Career, string> = {
    'ACTUARIA': 'Actuaría',
    'BIOLOGIA': 'Biología',
    'CIENCIAS_COMPUTACION': 'Ciencias de la Computación',
    'CIENCIAS_TIERRA': 'Ciencias de la Tierra',
    'FISICA': 'Física',
    'MATEMATICAS': 'Matemáticas',
    'MATEMATICAS_APLICADAS': 'Matemáticas Aplicadas'
  };

  const interests = [
    'Investigación', 'Programación', 'Matemáticas', 'Física',
    'Biología', 'Química', 'Estadística', 'Inteligencia Artificial',
    'Ciencia de Datos', 'Desarrollo Web', 'Robótica', 'Biotecnología'
  ];

  const goals = [
    'Conseguir trabajo en tech', 'Hacer investigación', 'Estudiar posgrado',
    'Emprender', 'Networking', 'Aprender nuevas tecnologías',
    'Participar en proyectos', 'Mentorear a otros'
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'interests' | 'goals', item: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.fullName.trim().length > 0;
      case 1:
        return formData.email.includes('@') && formData.career !== '';
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  const steps = [
    // Step 1: Información Personal
    <Step
      key="step1"
      title="¡Bienvenido a FCiencias!"
      subtitle="Comencemos conociendo un poco sobre ti"
      onNext={handleNext}
      canProceed={canProceed()}
      isFirst={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cuál es tu nombre completo?
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            placeholder="Ingresa tu nombre completo"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </Step>,

    // Step 2: Información Académica
    <Step
      key="step2"
      title="Información Académica"
      subtitle="Cuéntanos sobre tu carrera y email institucional"
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email institucional
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="tu.email@ciencias.unam.mx"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Qué carrera estudias?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {careers.map((career) => (
              <button
                key={career}
                type="button"
                onClick={() => updateFormData('career', career)}
                className={`p-3 text-left border rounded-lg transition-all ${
                  formData.career === career
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {careerLabels[career]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Step>,

    // Step 3: Intereses
    <Step
      key="step3"
      title="Tus Intereses"
      subtitle="Selecciona las áreas que más te interesan"
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
    >
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Puedes seleccionar múltiples opciones
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem('interests', interest)}
              className={`p-3 text-sm border rounded-lg transition-all ${
                formData.interests.includes(interest)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </Step>,

    // Step 4: Objetivos
    <Step
      key="step4"
      title="Tus Objetivos"
      subtitle="¿Qué esperas lograr en FCiencias?"
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
      isLast={true}
    >
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona tus principales objetivos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleArrayItem('goals', goal)}
              className={`p-3 text-left border rounded-lg transition-all ${
                formData.goals.includes(goal)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
    </Step>
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Paso {currentStep + 1} de 4
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / 4) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {steps[currentStep]}
      </AnimatePresence>
    </div>
  );
};

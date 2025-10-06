'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
}

interface OnboardingFlowProps {
  steps: OnboardingStep[];
  onComplete: (data: any) => void;
  onCancel?: () => void;
}

export function OnboardingFlow({ steps, onComplete, onCancel }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = useCallback(() => {
    if (isValid && !isLastStep) {
      setCurrentStep(prev => prev + 1);
      setIsValid(false);
    } else if (isValid && isLastStep) {
      onComplete(formData);
    }
  }, [isValid, isLastStep, onComplete, formData]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      setIsValid(true); // Assume previous step was valid
    }
  }, [isFirstStep]);

  const updateFormData = useCallback((stepData: any, valid: boolean = true) => {
    setFormData(prev => ({ ...prev, [step.id]: stepData }));
    setIsValid(valid);
  }, [step.id]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Marca */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-blue-700 font-sans">fciencias.app</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-sans text-gray-600">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-sans text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 text-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-sans leading-tight">
                {step.title}
              </h1>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">
                {step.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Step Content */}
          <div className="px-6 py-6 min-h-[350px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <step.component
                  data={formData[step.id]}
                  onChange={updateFormData}
                  onValidityChange={setIsValid}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {!isFirstStep && (
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors font-sans"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                )}
                
                {onCancel && isFirstStep && (
                  <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors font-sans"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Step Indicators */}
                <div className="hidden sm:flex items-center space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : index < currentStep
                          ? 'bg-blue-400'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!isValid}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 font-sans ${
                    isValid
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLastStep ? 'Completar' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer discreto */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-sans">
            © fciencias.app — Hecho por estudiantes 💙
          </p>
        </div>
      </div>
    </div>
  );
}

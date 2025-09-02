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
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body text-primary-200">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-body text-primary-200">
              {Math.round(progress)}% completado
            </span>
          </div>
          <div className="w-full bg-primary-600 rounded-full h-2">
            <motion.div
              className="bg-accent-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-8 py-6 border-b border-primary-200">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-2">
                {step.title}
              </h1>
              <p className="text-lg font-body text-text-muted">
                {step.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Step Content */}
          <div className="p-8 min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
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
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Anterior</span>
                </Button>
              )}
              
              {onCancel && isFirstStep && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className="text-text-muted"
                >
                  Cancelar
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Step Indicators */}
              <div className="hidden sm:flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-primary-600'
                        : index < currentStep
                        ? 'bg-accent-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isValid}
                className="flex items-center space-x-2 min-w-[120px]"
              >
                <span>{isLastStep ? 'Completar' : 'Siguiente'}</span>
                {!isLastStep && <ChevronRightIcon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

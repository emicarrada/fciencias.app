'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

import { CAREERS } from '@/types/onboarding';

interface CareerStepProps {
  data?: { career: string };
  onChange: (data: { career: string }, valid: boolean) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function CareerStep({ data, onChange, onValidityChange }: CareerStepProps) {
  const [selectedCareer, setSelectedCareer] = useState(data?.career || '');

  useEffect(() => {
    const isValid = selectedCareer.length > 0;
    onChange({ career: selectedCareer }, isValid);
    onValidityChange?.(isValid);
  }, [selectedCareer, onChange, onValidityChange]);

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareer(careerId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AcademicCapIcon className="w-12 h-12 text-primary-600" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
          ¿Cuál es tu carrera?
        </h3>
        <p className="text-text-muted font-body">
          Selecciona tu área de estudios para personalizar tu experiencia
        </p>
      </motion.div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CAREERS.map((career, index) => (
          <motion.button
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCareerSelect(career.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-200 text-left
              hover:scale-105 hover:shadow-lg
              ${selectedCareer === career.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary-300'
              }
            `}
          >
            {/* Selection indicator */}
            {selectedCareer === career.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Career icon */}
            <div className="text-4xl mb-3">{career.icon}</div>
            
            {/* Career name */}
            <h4 className="font-heading font-semibold text-text-primary mb-2">
              {career.name}
            </h4>
            
            {/* Career description */}
            <p className="text-sm font-body text-text-muted">
              {career.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Selected career preview */}
      {selectedCareer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
        >
          {(() => {
            const career = CAREERS.find(c => c.id === selectedCareer);
            return career ? (
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{career.icon}</div>
                <div>
                  <h4 className="font-heading font-semibold text-primary-800">
                    Has seleccionado: {career.name}
                  </h4>
                  <p className="font-body text-primary-600">
                    Te conectaremos con otros estudiantes y contenido relevante para {career.name}
                  </p>
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>
      )}
    </div>
  );
}

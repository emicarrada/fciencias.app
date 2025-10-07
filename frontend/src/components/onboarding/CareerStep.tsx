'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AcademicCapIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans">
          ¿Cuál es tu carrera?
        </h3>
        <p className="text-sm text-gray-600 font-sans">
          Selecciona tu área de estudios para personalizar tu experiencia
        </p>
      </motion.div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAREERS.map((career, index) => (
          <motion.button
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCareerSelect(career.id)}
            className={`
              relative p-4 md:p-6 rounded-xl border transition-all duration-200 text-center
              hover:scale-[1.02] hover:shadow-md min-h-[100px] md:min-h-[120px]
              flex flex-col items-center justify-center
              ${selectedCareer === career.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }
            `}
          >
            {/* Selection indicator */}
            {selectedCareer === career.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}

            {/* Career icon */}
            <div className="mb-3 flex justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 relative">
                <Image
                  src={career.icon}
                  alt={`${career.name} icon`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Career name */}
            <h4 className="font-semibold text-gray-900 text-sm md:text-base font-sans text-center">
              {career.name}
            </h4>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

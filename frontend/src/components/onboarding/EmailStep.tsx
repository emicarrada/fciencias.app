'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';

interface EmailStepProps {
  data?: { email: string };
  onChange: (data: { email: string }, valid: boolean) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function EmailStep({ data, onChange, onValidityChange }: EmailStepProps) {
  const [email, setEmail] = useState(data?.email || '');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ciencias\.unam\.mx$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const valid = validateEmail(email) && email.length > 0;
    setIsValid(valid);
    
    if (email.length > 0 && !validateEmail(email)) {
      setError('Debe ser un correo válido de @ciencias.unam.mx');
    } else {
      setError('');
    }

    onChange({ email }, valid);
    onValidityChange?.(valid);
  }, [email, onChange, onValidityChange]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <EnvelopeIcon className="w-12 h-12 text-primary-600" />
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Correo Institucional
        </h3>
        <p className="text-text-muted font-body leading-relaxed">
          Para garantizar que eres parte de la comunidad de la Facultad de Ciencias,
          necesitamos tu correo institucional oficial.
        </p>
      </motion.div>

      {/* Email Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="relative">
          <Input
            type="email"
            placeholder="tu.nombre@ciencias.unam.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`text-center text-lg px-6 py-4 ${
              error ? 'border-accent-red-500 focus:ring-accent-red-500' : 
              isValid ? 'border-accent-green-500 focus:ring-accent-green-500' : ''
            }`}
            autoFocus
          />
          
          {isValid && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-6 h-6 bg-accent-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent-red-500 text-sm font-body"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-200"
      >
        <div className="flex items-start space-x-3">
          <AcademicCapIcon className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-heading font-semibold text-primary-800 mb-1">
              ¿Por qué necesitamos tu correo institucional?
            </h4>
            <p className="text-sm font-body text-primary-700 leading-relaxed">
              Tu correo de @ciencias.unam.mx nos ayuda a verificar que eres parte de nuestra 
              comunidad académica y te da acceso a funciones exclusivas para estudiantes y 
              personal de la facultad.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

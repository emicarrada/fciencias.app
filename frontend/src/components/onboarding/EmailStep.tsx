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
    <div className="max-w-sm mx-auto text-center">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <EnvelopeIcon className="w-8 h-8 text-blue-600" />
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans">
          Correo Institucional
        </h3>
        <p className="text-sm text-gray-600 font-sans leading-relaxed">
          Usa tu correo de @ciencias.unam.mx para verificar que eres parte de la comunidad.
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
          <input
            type="email"
            placeholder="tu.nombre@ciencias.unam.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full text-center text-base px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all font-sans ${
              error ? 'border-red-300 focus:ring-red-500' : 
              isValid ? 'border-green-300 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
            } placeholder-gray-400`}
            autoFocus
          />
          
          {isValid && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
            className="text-red-500 text-sm font-sans"
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
        className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100"
      >
        <div className="flex items-start space-x-3">
          <AcademicCapIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-semibold text-blue-900 mb-1 text-sm font-sans">
              ¿Por qué necesitamos tu correo institucional?
            </h4>
            <p className="text-xs font-sans text-blue-700 leading-relaxed">
              Tu correo de @ciencias.unam.mx nos ayuda a verificar que eres parte de nuestra 
              comunidad académica.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

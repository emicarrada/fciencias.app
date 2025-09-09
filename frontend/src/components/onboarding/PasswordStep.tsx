'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';

interface PasswordStepProps {
  data?: { password: string };
  onChange: (data: { password: string }, valid: boolean) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function PasswordStep({ data, onChange, onValidityChange }: PasswordStepProps) {
  const [password, setPassword] = useState(data?.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword, onChange, onValidityChange]);

  const validatePassword = () => {
    const newErrors: string[] = [];
    
    // Validaciones de contraseña
    if (password.length < 8) {
      newErrors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      newErrors.push('Al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      newErrors.push('Al menos un número');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.push('Al menos un carácter especial');
    }
    if (password !== confirmPassword && confirmPassword !== '') {
      newErrors.push('Las contraseñas no coinciden');
    }

    setErrors(newErrors);
    const valid = password.length > 0 && confirmPassword.length > 0 && newErrors.length === 0;
    setIsValid(valid);
    
    // Notificar cambios al OnboardingFlow
    onChange({ password }, valid);
    onValidityChange?.(valid);
  };

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Débil' };
    if (strength <= 3) return { level: 'medium', color: 'bg-yellow-500', text: 'Media' };
    if (strength <= 4) return { level: 'good', color: 'bg-blue-500', text: 'Buena' };
    return { level: 'strong', color: 'bg-green-500', text: 'Fuerte' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Icono */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <KeyIcon className="w-12 h-12 text-primary-600" />
      </motion.div>

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
          Crea tu Contraseña
        </h3>
        <p className="text-text-muted font-body leading-relaxed">
          Elige una contraseña segura para proteger tu cuenta. Asegúrate de que sea única y fácil de recordar para ti.
        </p>
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {/* Campo de contraseña */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-left pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Campo de confirmación */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-left pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Indicador de fortaleza */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Seguridad:</span>
              <span className={`font-medium ${
                strength.level === 'weak' ? 'text-red-600' :
                strength.level === 'medium' ? 'text-yellow-600' :
                strength.level === 'good' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {strength.text}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${((password.length >= 8 ? 1 : 0) + 
                  (/[A-Z]/.test(password) ? 1 : 0) + 
                  (/[a-z]/.test(password) ? 1 : 0) + 
                  (/[0-9]/.test(password) ? 1 : 0) + 
                  (/[^A-Za-z0-9]/.test(password) ? 1 : 0)) * 20}%` }}
              />
            </div>
          </div>
        )}

        {/* Lista de errores */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">Tu contraseña debe tener:</p>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Consejos de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <KeyIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-heading font-semibold text-blue-800 mb-1">
                Consejos para una contraseña segura:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Usa una combinación única que solo tú conozcas</li>
                <li>• Evita información personal obvia</li>
                <li>• Considera usar una frase memorable</li>
                <li>• No la compartas con nadie</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

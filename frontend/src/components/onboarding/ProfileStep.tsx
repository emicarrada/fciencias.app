'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';

interface ProfileStepProps {
  data?: { fullName: string; username: string };
  onChange: (data: { fullName: string; username: string }, valid: boolean) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function ProfileStep({ data, onChange, onValidityChange }: ProfileStepProps) {
  const [fullName, setFullName] = useState(data?.fullName || '');
  const [username, setUsername] = useState(data?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const validateUsername = useCallback((username: string) => {
    // Reglas más flexibles:
    // - Entre 2-30 caracteres
    // - Puede contener letras, números, guiones, puntos y guiones bajos
    // - No puede empezar o terminar con símbolos
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,28}[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
    return username.length >= 2 && username.length <= 30 && usernameRegex.test(username);
  }, []);

  const validateFullName = useCallback((name: string) => {
    return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name);
  }, []);

  // Simulate username availability check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!validateUsername(username)) return;
    
    setIsCheckingUsername(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, make some usernames "taken"
    const takenUsernames = ['admin', 'test', 'user', 'ciencias', 'unam'];
    const isTaken = takenUsernames.includes(username.toLowerCase());
    
    setUsernameError(isTaken ? 'Este nombre de usuario ya está en uso' : '');
    setIsCheckingUsername(false);
    
    return !isTaken;
  }, [validateUsername]);

  useEffect(() => {
    const nameValid = validateFullName(fullName);
    const usernameValid = validateUsername(username) && !usernameError;
    const isValid = nameValid && usernameValid && username.length > 0;

    onChange({ fullName, username }, isValid);
    onValidityChange?.(isValid);

    // Check username availability with debounce
    if (validateUsername(username)) {
      const timer = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 300);
      return () => clearTimeout(timer);
    } else if (username.length > 0) {
      setUsernameError('');
    } else {
      setUsernameError('');
    }
  }, [fullName, username, usernameError, onChange, onValidityChange, validateFullName, validateUsername, checkUsernameAvailability]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserIcon className="w-12 h-12 text-primary-600" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
          Tu Identidad en FCiencias
        </h3>
        <p className="text-text-muted font-body">
          Cuéntanos cómo te llamas y elige tu nombre de usuario único
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="block text-sm font-body font-medium text-text-primary">
            Nombre completo
          </label>
          <Input
            type="text"
            placeholder="Ej: María González López"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`${
              fullName.length > 0 && validateFullName(fullName) 
                ? 'border-accent-green-500 focus:ring-accent-green-500' 
                : fullName.length > 0 
                ? 'border-accent-red-500 focus:ring-accent-red-500' 
                : ''
            }`}
          />
          {fullName.length > 0 && !validateFullName(fullName) && (
            <p className="text-accent-red-500 text-sm font-body">
              Ingresa tu nombre completo (solo letras y espacios)
            </p>
          )}
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="block text-sm font-body font-medium text-text-primary">
            Nombre de usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSymbolIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="tu_nombre_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className={`pl-10 ${
                username.length > 0 && validateUsername(username) && !usernameError
                  ? 'border-accent-green-500 focus:ring-accent-green-500' 
                  : username.length > 0 || usernameError
                  ? 'border-accent-red-500 focus:ring-accent-red-500' 
                  : ''
              }`}
            />
            
            {/* Loading indicator */}
            {isCheckingUsername && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              </div>
            )}
            
            {/* Success indicator */}
            {username.length > 0 && validateUsername(username) && !usernameError && !isCheckingUsername && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-5 h-5 bg-accent-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {usernameError && (
            <p className="text-accent-red-500 text-sm font-body">{usernameError}</p>
          )}
          
          {username.length > 0 && !validateUsername(username) && !usernameError && (
            <p className="text-accent-red-500 text-sm font-body">
              2-30 caracteres, puede incluir letras, números, puntos, guiones y guión bajo
            </p>
          )}
          
          <p className="text-text-muted text-xs font-body">
            Tu nombre de usuario será tu identificador único en FCiencias.app
          </p>
        </motion.div>

        {/* Preview Card */}
        {fullName && username && validateFullName(fullName) && validateUsername(username) && !usernameError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
          >
            <h4 className="font-heading font-semibold text-primary-800 mb-3">
              Vista previa de tu perfil
            </h4>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-heading font-bold text-lg">
                  {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-body font-semibold text-primary-800">{fullName}</p>
                <p className="font-body text-primary-600">@{username}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

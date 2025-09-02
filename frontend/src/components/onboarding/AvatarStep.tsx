'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircleIcon, SwatchIcon } from '@heroicons/react/24/outline';

import { AVATAR_COLORS } from '@/types/onboarding';

interface AvatarStepProps {
  data?: { avatarColor: string; fullName?: string; username?: string };
  onChange: (data: { avatarColor: string }, valid: boolean) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function AvatarStep({ data, onChange, onValidityChange }: AvatarStepProps) {
  const [selectedColor, setSelectedColor] = useState(data?.avatarColor || 'blue');
  
  // Get user initials from previous steps
  const fullName = data?.fullName || 'Usuario';
  const username = data?.username || 'usuario';
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const isValid = selectedColor.length > 0;
    onChange({ avatarColor: selectedColor }, isValid);
    onValidityChange?.(isValid);
  }, [selectedColor, onChange, onValidityChange]);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
  };

  const selectedColorObj = AVATAR_COLORS.find(c => c.id === selectedColor);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SwatchIcon className="w-12 h-12 text-primary-600" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
          Personaliza tu Avatar
        </h3>
        <p className="text-text-muted font-body">
          Elige un color que represente tu personalidad
        </p>
      </motion.div>

      {/* Avatar Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="text-center">
          <div className={`
            w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg
            ${selectedColorObj?.bg || 'bg-blue-500'} ${selectedColorObj?.text || 'text-white'}
            transition-all duration-300
          `}>
            <span className="text-4xl font-heading font-bold">
              {initials}
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-heading font-semibold text-text-primary">
              {fullName}
            </p>
            <p className="font-body text-text-muted text-sm">
              @{username}
            </p>
            <p className="font-body text-primary-600 text-sm">
              {selectedColorObj?.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Color Selection Grid */}
      <div className="space-y-6">
        <h4 className="text-center font-heading font-semibold text-text-primary">
          Selecciona tu color favorito
        </h4>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {AVATAR_COLORS.map((color, index) => (
            <motion.button
              key={color.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleColorSelect(color.id)}
              className={`
                relative group p-1 rounded-2xl transition-all duration-200
                ${selectedColor === color.id 
                  ? 'ring-4 ring-primary-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                }
              `}
            >
              {/* Color Circle */}
              <div className={`
                w-16 h-16 rounded-xl ${color.bg} flex items-center justify-center
                shadow-md group-hover:shadow-lg transition-shadow duration-200
              `}>
                <span className={`text-lg font-heading font-bold ${color.text}`}>
                  {initials}
                </span>
              </div>
              
              {/* Color Name */}
              <p className="text-xs font-body text-text-muted mt-2 text-center leading-tight">
                {color.name}
              </p>

              {/* Selection indicator */}
              {selectedColor === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Complete Profile Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
      >
        <h4 className="font-heading font-semibold text-primary-800 mb-4 text-center">
          ¡Tu perfil está listo! 🎉
        </h4>
        <div className="flex items-center justify-center space-x-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center shadow-md
            ${selectedColorObj?.bg} ${selectedColorObj?.text}
          `}>
            <span className="text-xl font-heading font-bold">
              {initials}
            </span>
          </div>
          <div>
            <p className="font-body font-semibold text-primary-800">{fullName}</p>
            <p className="font-body text-primary-600">@{username}</p>
            <p className="font-body text-primary-500 text-sm">{selectedColorObj?.name}</p>
          </div>
        </div>
        <p className="text-center font-body text-primary-700 text-sm mt-4">
          Podrás cambiar estos datos desde tu perfil en cualquier momento
        </p>
      </motion.div>
    </div>
  );
}

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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SwatchIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans">
          Personaliza tu Avatar
        </h3>
        <p className="text-sm text-gray-600 font-sans">
          Elige un color que represente tu personalidad
        </p>
      </motion.div>

      {/* Avatar Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="text-center">
          <div className={`
            w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md
            ${selectedColorObj?.bg || 'bg-blue-500'} ${selectedColorObj?.text || 'text-white'}
            transition-all duration-300
          `}>
            <span className="text-2xl font-bold font-sans">
              {initials}
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 font-sans text-sm">
              {fullName}
            </p>
            <p className="font-sans text-gray-600 text-xs">
              @{username}
            </p>
            <p className="font-sans text-blue-600 text-xs">
              {selectedColorObj?.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Color Selection Grid */}
      <div className="space-y-4">
        <h4 className="text-center font-semibold text-gray-900 font-sans text-sm">
          Selecciona tu color favorito
        </h4>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {AVATAR_COLORS.map((color, index) => (
            <motion.button
              key={color.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => handleColorSelect(color.id)}
              className={`
                relative group p-1 rounded-xl transition-all duration-200
                ${selectedColor === color.id 
                  ? 'ring-2 ring-blue-500 ring-offset-1' 
                  : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                }
              `}
            >
              {/* Color Circle */}
              <div className={`
                w-12 h-12 rounded-lg ${color.bg} flex items-center justify-center
                shadow-sm group-hover:shadow-md transition-shadow duration-200
              `}>
                <span className={`text-sm font-bold font-sans ${color.text}`}>
                  {initials}
                </span>
              </div>
              
              {/* Color Name */}
              <p className="text-xs font-sans text-gray-600 mt-1 text-center leading-tight">
                {color.name}
              </p>

              {/* Selection indicator */}
              {selectedColor === color.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
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
        className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
      >
        <h4 className="font-semibold text-blue-800 mb-3 text-center text-sm font-sans">
          ¡Tu perfil está listo! 🎉
        </h4>
        <div className="flex items-center justify-center space-x-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center shadow-sm
            ${selectedColorObj?.bg} ${selectedColorObj?.text}
          `}>
            <span className="text-lg font-bold font-sans">
              {initials}
            </span>
          </div>
          <div>
            <p className="font-semibold text-blue-800 font-sans text-sm">{fullName}</p>
            <p className="font-sans text-blue-600 text-xs">@{username}</p>
            <p className="font-sans text-blue-500 text-xs">{selectedColorObj?.name}</p>
          </div>
        </div>
        <p className="text-center font-sans text-blue-700 text-xs mt-3">
          Podrás cambiar estos datos desde tu perfil en cualquier momento
        </p>
      </motion.div>
    </div>
  );
}

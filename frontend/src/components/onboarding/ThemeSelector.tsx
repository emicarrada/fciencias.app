'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME_COLORS, ThemeColor, generateInitialsAvatar } from '@/lib/themes';
import { Button } from '@/components/ui/Button';

interface OnboardingStep2Props {
  onNext: (themeColor: ThemeColor) => void;
  onBack: () => void;
  userName: string;
}

export default function ThemeSelector({ onNext, onBack, userName }: OnboardingStep2Props) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>('unam-blue');

  const themeOptions = Object.entries(THEME_COLORS).map(([key, theme]) => ({
    id: key as ThemeColor,
    ...theme
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Personaliza tu experiencia 🎨
        </h2>
        <p className="text-lg text-gray-600">
          Elige el tema visual que más te represente
        </p>
      </motion.div>

      {/* Preview del avatar con tema seleccionado */}
      <motion.div 
        className="flex justify-center mb-8"
        layout
      >
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ 
              background: THEME_COLORS[selectedTheme].gradient 
            }}
          >
            {generateInitialsAvatar(userName, selectedTheme).initials}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </motion.div>

      {/* Grid de opciones de tema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {themeOptions.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                selectedTheme === theme.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              {/* Muestra del tema */}
              <div className="mb-4">
                <div 
                  className="w-full h-20 rounded-lg"
                  style={{ background: theme.gradient }}
                />
                <div className="flex mt-2 space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                {theme.name}
              </h3>

              {/* Checkmark cuando está seleccionado */}
              {selectedTheme === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navegación */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          ← Atrás
        </Button>
        
        <Button
          onClick={() => onNext(selectedTheme)}
          style={{ 
            backgroundColor: THEME_COLORS[selectedTheme].primary,
            borderColor: THEME_COLORS[selectedTheme].primary 
          }}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}

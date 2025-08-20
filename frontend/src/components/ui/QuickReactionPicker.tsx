'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactionButton, ReactionType } from '@/components/ui/ReactionButton';
import { PlusIcon } from '@heroicons/react/24/outline';

interface QuickReactionPickerProps {
  onReaction: (type: ReactionType) => void;
  reactions: Record<ReactionType, { count: number; isActive: boolean }>;
  disabled?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const allReactionTypes: ReactionType[] = [
  'like', 'dislike', 'love', 'surprised', 'laugh'
];

export default function QuickReactionPicker({ 
  onReaction, 
  reactions, 
  disabled = false,
  position = 'top'
}: QuickReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);

  const handleReactionClick = (type: ReactionType) => {
    onReaction(type);
    setIsOpen(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div className="relative">
      {/* Botón trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed
          transition-all duration-200 group
          ${isOpen 
            ? 'border-blue-400 bg-blue-50 text-blue-600' 
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-label="Abrir selector de reacciones"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon className="w-5 h-5" />
        </motion.div>
        
        {/* Pulso cuando está cerrado */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 0.3, 0] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Picker desplegable */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para cerrar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-10 bg-black bg-opacity-10"
            />
            
            {/* Contenedor del picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`
                absolute z-20 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3
                ${getPositionClasses()}
              `}
            >
              {/* Flecha indicadora */}
              <div 
                className={`
                  absolute w-3 h-3 bg-white border-gray-200 transform rotate-45
                  ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-r' : ''}
                  ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-t border-l' : ''}
                  ${position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-t border-r' : ''}
                  ${position === 'right' ? 'right-full top-1/2 translate-x-1/2 -translate-y-1/2 border-b border-l' : ''}
                `}
              />
              
              {/* Grid de reacciones */}
              <div className="grid grid-cols-4 gap-2 min-w-0">
                {allReactionTypes.map((type, index) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }}
                    onHoverStart={() => setHoveredReaction(type)}
                    onHoverEnd={() => setHoveredReaction(null)}
                    className="relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReactionClick(type)}
                      className="cursor-pointer"
                    >
                      <ReactionButton
                        type={type}
                        count={reactions[type]?.count || 0}
                        isActive={reactions[type]?.isActive || false}
                        onClick={() => {}}
                        size="sm"
                      />
                    </motion.div>
                    
                    {/* Tooltip mejorado */}
                    <AnimatePresence>
                      {hoveredReaction === type && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.9 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.9 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-30"
                        >
                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              {/* Estadística rápida */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 pt-2 border-t border-gray-100 text-center"
              >
                <div className="text-xs text-gray-500">
                  {Object.values(reactions).reduce((sum, r) => sum + r.count, 0)} reacciones totales
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LikeIcon, DislikeIcon, LoveIcon, SurprisedIcon, LaughIcon } from './ReactionIcons';

export type ReactionType = 'like' | 'dislike' | 'love' | 'surprised' | 'laugh';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const reactionConfig = {
  like: {
    label: 'Me gusta',
    icon: LikeIcon,
    iconSolid: LikeIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    particle: '👍',
  },
  dislike: {
    label: 'No me gusta',
    icon: DislikeIcon,
    iconSolid: DislikeIcon,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    particle: '👎',
  },
  love: {
    label: 'Me encanta',
    icon: LoveIcon,
    iconSolid: LoveIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    particle: '❤️',
  },
  surprised: {
    label: 'Sorprendido',
    icon: SurprisedIcon,
    iconSolid: SurprisedIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    particle: '�',
  },
  laugh: {
    label: 'Me divierte',
    icon: LaughIcon,
    iconSolid: LaughIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100',
    particle: '😂',
  },
};

const sizeConfig = {
  sm: {
    button: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1',
  },
  md: {
    button: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
  lg: {
    button: 'px-4 py-2 text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
};

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  type,
  count,
  isActive,
  onClick,
  disabled = false,
  size = 'md',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const config = reactionConfig[type];
  const sizeStyles = sizeConfig[size];
  
  const IconComponent = isActive ? config.iconSolid : config.icon;

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    
    // Mostrar partículas cuando se activa
    if (!isActive) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 800);
    }
    
    onClick();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
  };

  const iconVariants = {
    initial: { 
      scale: 1,
      rotate: 0,
    },
    hover: { 
      scale: 1.1,
      rotate: isActive ? 0 : 8,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { 
      scale: 0.9,
      rotate: 0,
    },
    activate: {
      scale: [1, 1.4, 1.1],
      rotate: [0, 15, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0 },
    pulse: {
      scale: [1, 2, 1],
      opacity: [0, 0.3, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative">
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled ? "hover" : "initial"}
        whileTap={!disabled ? "tap" : "initial"}
        onClick={handleClick}
        disabled={disabled}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          relative inline-flex items-center justify-center rounded-full border transition-all duration-200
          ${sizeStyles.button} ${sizeStyles.gap}
          ${isActive 
            ? `${config.color} ${config.bgColor} border-current shadow-sm` 
            : `text-gray-500 bg-white border-gray-200 hover:text-gray-700 ${config.hoverColor}`
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          overflow-hidden
        `}
        aria-label={`${config.label}: ${count} reacciones`}
        title={config.label}
      >
        {/* Efecto de pulso de fondo */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.bgColor}`}
            variants={pulseVariants}
            initial="initial"
            animate="pulse"
            key={isAnimating ? "animating" : "idle"}
          />
        )}

        {/* Icono con animación mejorada */}
        <motion.div
          variants={iconVariants}
          animate={
            isAnimating 
              ? "activate" 
              : isHovered 
                ? "hover" 
                : "initial"
          }
          className="relative z-10"
        >
          <IconComponent className={sizeStyles.icon} />
        </motion.div>
        
        {/* Contador con animación suave */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ scale: 0.8, opacity: 0, y: 5 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="font-medium relative z-10"
          >
            {count > 0 ? count : ''}
          </motion.span>
        </AnimatePresence>

        {/* Efecto de onda al hacer clic */}
        {isAnimating && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.bgColor} opacity-40`}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* Partículas de celebración */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Partículas emoji */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`emoji-${i}`}
                className="absolute text-lg"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-0.5rem',
                  marginTop: '-0.5rem',
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60,
                  opacity: [1, 1, 0],
                  rotate: (Math.random() - 0.5) * 180
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                {config.particle}
              </motion.div>
            ))}
            
            {/* Partículas brillantes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className={`absolute w-1 h-1 ${config.bgColor.replace('bg-', 'bg-')} rounded-full`}
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 80,
                  y: (Math.random() - 0.5) * 80,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente para grupo de reacciones
interface ReactionGroupProps {
  reactions: Record<ReactionType, { count: number; isActive: boolean }>;
  onReaction: (type: ReactionType) => void;
  size?: 'sm' | 'md' | 'lg';
  maxVisible?: number;
  disabled?: boolean;
}

export const ReactionGroup: React.FC<ReactionGroupProps> = ({
  reactions,
  onReaction,
  size = 'md',
  maxVisible = 5,
  disabled = false,
}) => {
  const reactionTypes = Object.keys(reactions) as ReactionType[];
  const visibleReactions = reactionTypes.slice(0, maxVisible);
  
  return (
    <div className="flex flex-wrap gap-2">
      {visibleReactions.map((type) => (
        <ReactionButton
          key={type}
          type={type}
          count={reactions[type].count}
          isActive={reactions[type].isActive}
          onClick={() => onReaction(type)}
          size={size}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default ReactionButton;

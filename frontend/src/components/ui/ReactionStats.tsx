'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReactionType } from '@/components/ui/ReactionButton';
import { LikeIcon, DislikeIcon, LoveIcon, SurprisedIcon, LaughIcon } from './ReactionIcons';

const reactionIcons = {
  like: LikeIcon,
  dislike: DislikeIcon,
  love: LoveIcon,
  surprised: SurprisedIcon,
  laugh: LaughIcon,
};

const reactionColors = {
  like: 'text-blue-500',
  dislike: 'text-gray-500',
  love: 'text-red-500',
  surprised: 'text-orange-500',
  laugh: 'text-yellow-500',
};

interface ReactionStatsProps {
  reactions: Record<ReactionType, { count: number; isActive: boolean }>;
  showPercentages?: boolean;
  compact?: boolean;
}

export default function ReactionStats({ 
  reactions, 
  showPercentages = false, 
  compact = false 
}: ReactionStatsProps) {
  const totalCount = Object.values(reactions).reduce((sum, r) => sum + r.count, 0);
  
  const sortedReactions = Object.entries(reactions)
    .filter(([_, data]) => data.count > 0)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, compact ? 3 : 7);

  if (totalCount === 0) {
    return (
      <div className="text-sm text-gray-400 italic">
        Sin reacciones aún
      </div>
    );
  }

  return (
    <div className={`space-y-${compact ? '1' : '2'}`}>
      {sortedReactions.map(([type, data], index) => {
        const reactionType = type as ReactionType;
        const Icon = reactionIcons[reactionType];
        const percentage = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
        
        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            {/* Icono y label */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon className={`w-4 h-4 ${reactionColors[reactionType]} flex-shrink-0`} />
              <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-700 truncate`}>
                {reactionType.charAt(0).toUpperCase() + reactionType.slice(1).replace('-', ' ')}
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className={`flex-1 bg-gray-100 rounded-full ${compact ? 'h-1.5' : 'h-2'} overflow-hidden`}>
              <motion.div
                className={`h-full bg-gradient-to-r from-current to-current opacity-20 ${reactionColors[reactionType]}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
              />
            </div>
            
            {/* Contador y porcentaje */}
            <div className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-600 min-w-0`}>
              <span>{data.count}</span>
              {showPercentages && (
                <span className="text-gray-400 ml-1">
                  ({percentage.toFixed(0)}%)
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
      
      {/* Total */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sortedReactions.length * 0.1 + 0.2 }}
          className="pt-2 border-t border-gray-100"
        >
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total de reacciones</span>
            <span className="font-semibold text-gray-800">{totalCount}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

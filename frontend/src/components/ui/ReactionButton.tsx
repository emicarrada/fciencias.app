'use client';

import React from 'react';
import { trackEvent } from '@/hooks/useGoogleAnalytics';

export type ReactionType = 'like' | 'dislike' | 'love' | 'surprised' | 'laugh';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  contentId?: string; // For analytics tracking
  contentType?: 'announcement' | 'event' | 'comment'; // For analytics tracking
}

const reactionConfig = {
  like: {
    label: 'Me gusta',
    emoji: '👍',
    activeColor: 'text-blue-600 bg-blue-100 border-blue-200',
    inactiveColor: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  dislike: {
    label: 'No me gusta',
    emoji: '👎',
    activeColor: 'text-red-600 bg-red-100 border-red-200',
    inactiveColor: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  love: {
    label: 'Me encanta',
    emoji: '❤️',
    activeColor: 'text-red-600 bg-red-100 border-red-200',
    inactiveColor: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  surprised: {
    label: 'Sorprendido',
    emoji: '😮',
    activeColor: 'text-orange-600 bg-orange-100 border-orange-200',
    inactiveColor: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
  laugh: {
    label: 'Me divierte',
    emoji: '😂',
    activeColor: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    inactiveColor: 'text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  type,
  count,
  isActive,
  onClick,
  disabled = false,
  size = 'md',
  contentId,
  contentType = 'announcement',
}) => {
  const config = reactionConfig[type];
  const sizeClass = sizeConfig[size];

  const handleClick = () => {
    onClick();
    
    // Track analytics event
    if (contentId && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
      trackEvent.announcementReaction(type, contentId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 rounded-full border transition-colors duration-200
        ${sizeClass}
        ${isActive ? config.activeColor : config.inactiveColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      `}
      title={config.label}
    >
      <span className="text-base">{config.emoji}</span>
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
};

// Componente para grupo de reacciones
interface ReactionGroupProps {
  reactions: Record<ReactionType, { count: number; isActive: boolean }>;
  onReaction: (type: ReactionType) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  contentId?: string; // For analytics tracking
  contentType?: 'announcement' | 'event' | 'comment'; // For analytics tracking
}

export const ReactionGroup: React.FC<ReactionGroupProps> = ({
  reactions,
  onReaction,
  size = 'md',
  disabled = false,
  contentId,
  contentType = 'announcement',
}) => {
  const reactionTypes: ReactionType[] = ['like', 'dislike', 'love', 'surprised', 'laugh'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {reactionTypes.map((type) => (
        <ReactionButton
          key={type}
          type={type}
          count={reactions[type].count}
          isActive={reactions[type].isActive}
          onClick={() => onReaction(type)}
          size={size}
          disabled={disabled}
          contentId={contentId}
          contentType={contentType}
        />
      ))}
    </div>
  );
};

export default ReactionButton;

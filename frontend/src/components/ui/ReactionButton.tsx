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
    activeColor: 'text-accent-green-700 bg-accent-green-100 border-accent-green-300',
    inactiveColor: 'text-text-muted bg-secondary-50 border-gray-200 hover:bg-gray-100',
  },
  dislike: {
    label: 'No me gusta',
    emoji: '👎',
    activeColor: 'text-accent-red-700 bg-accent-red-100 border-accent-red-300',
    inactiveColor: 'text-text-muted bg-secondary-50 border-gray-200 hover:bg-gray-100',
  },
  love: {
    label: 'Me encanta',
    emoji: '❤️',
    activeColor: 'text-pink-700 bg-pink-100 border-pink-300',
    inactiveColor: 'text-text-muted bg-secondary-50 border-gray-200 hover:bg-gray-100',
  },
  surprised: {
    label: 'Sorprendido',
    emoji: '😮',
    activeColor: 'text-orange-700 bg-orange-100 border-orange-300',
    inactiveColor: 'text-text-muted bg-secondary-50 border-gray-200 hover:bg-gray-100',
  },
  laugh: {
    label: 'Me divierte',
    emoji: '😂',
    activeColor: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    inactiveColor: 'text-text-muted bg-secondary-50 border-gray-200 hover:bg-gray-100',
  },
};

const sizeConfig = {
  sm: 'px-3 py-2 text-xs min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-[40px]',
  lg: 'px-5 py-3 text-base min-h-[44px]',
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
        inline-flex items-center gap-2 rounded-xl border-2 transition-all duration-200 font-body
        ${sizeClass}
        ${isActive ? config.activeColor : config.inactiveColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        shadow-sm hover:shadow-md
      `}
      title={`${config.label} (${count})`}
      aria-label={`${config.label}: ${count} reacciones`}
    >
      <span className="text-lg">{config.emoji}</span>
      {count > 0 && <span className="font-semibold">{count}</span>}
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

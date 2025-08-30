'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ReactionGroup } from './ReactionButton';
import { useReactions } from '../../hooks/useReactions';
import { 
  UserIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

interface AnnouncementCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  createdAt: string;
  category?: string;
  commentsCount?: number;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  className?: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  id,
  title,
  content,
  author,
  createdAt,
  category,
  commentsCount = 0,
  isBookmarked = false,
  onBookmark,
  onShare,
  onComment,
  className = '',
}) => {
  const {
    reactions,
    handleReaction,
    isLoading,
    totalReactions,
    hasUserReacted,
  } = useReactions({
    contentId: id,
    contentType: 'announcement',
    initialReactions: {
      like: { count: Math.floor(Math.random() * 15), isActive: false },
      love: { count: Math.floor(Math.random() * 8), isActive: false },
      dislike: { count: Math.floor(Math.random() * 3), isActive: false },
      surprised: { count: Math.floor(Math.random() * 5), isActive: false },
      laugh: { count: Math.floor(Math.random() * 10), isActive: false },
    },
    userId: 'current-user-id', // Replace with actual user ID
  });

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {author.avatar ? (
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{author.name}</h4>
              {author.role && (
                <p className="text-sm text-gray-500">{author.role}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </div>
        </div>

        {/* Category */}
        {category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md mb-3">
            {category}
          </span>
        )}

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {title}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {truncateContent(content)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Reactions */}
          <div className="flex items-center space-x-4">
            <ReactionGroup
              reactions={reactions}
              onReaction={handleReaction}
              size="sm"
              disabled={isLoading}
            />
            {totalReactions > 0 && (
              <span className="text-sm text-gray-500">
                {totalReactions} {totalReactions === 1 ? 'reacción' : 'reacciones'}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Comments */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComment}
              className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>{commentsCount}</span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              title="Compartir"
            >
              <ShareIcon className="w-4 h-4" />
            </motion.button>

            {/* Bookmark */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookmark}
              className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              title={isBookmarked ? 'Quitar de guardados' : 'Guardar'}
            >
              {isBookmarked ? (
                <BookmarkSolid className="w-4 h-4" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default AnnouncementCard;

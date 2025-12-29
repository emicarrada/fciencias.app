'use client';

import { SimplePost } from '@/types/post';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: SimplePost;
}

export default function PostCard({ post }: PostCardProps) {
  const getInitial = (username: string | null) => {
    if (!username) return 'A';
    return username.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
    } catch {
      return 'hace un momento';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: post.isAnonymous ? '#6B7280' : (post.author?.avatarColor || '#3B82F6') }}
        >
          {post.isAnonymous ? 'A' : getInitial(post.author?.username || null)}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {post.isAnonymous ? 'Anónimo' : (post.author?.username || 'Usuario')}
          </div>
          <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="rounded-lg max-w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

'use client';

import { useAuth } from '@/hooks/business/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreatePostForm from '@/components/posts/CreatePostForm';
import PostFeed from '@/components/posts/PostFeed';

export default function FeedPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handlePostCreated = () => {
    // Forzar recarga del feed
    setFeedKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">FCiencias Feed</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={() => router.push('/perfil')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Mi Perfil
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Crear Post */}
        <CreatePostForm onSuccess={handlePostCreated} />

        {/* Feed */}
        <PostFeed key={feedKey} />
      </main>
    </div>
  );
}

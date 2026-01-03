'use client';

import { useAuth } from '@/hooks/business/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreatePostForm from '@/components/posts/CreatePostForm';
import PostFeed from '@/components/posts/PostFeed';
import Loader from '@/components/ui/Loader';

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
        <Loader size={48} />
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

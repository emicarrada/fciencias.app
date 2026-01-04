'use client';

import { useAuth } from '@/hooks/business/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PostFeed from '@/components/posts/PostFeed';
import Loader from '@/components/ui/Loader';

export default function FeedPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Feed */}
        <PostFeed />
      </main>
    </div>
  );
}

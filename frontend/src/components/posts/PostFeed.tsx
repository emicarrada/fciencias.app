'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FeedResponse, SimplePost } from '@/types/post';
import PostCard from './PostCard';
import { toast } from 'react-hot-toast';
import Loader from '@/components/ui/Loader';

export default function PostFeed() {
  const [posts, setPosts] = useState<SimplePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get<FeedResponse>('/api/v1/posts/feed');
      
      if (response.data.success) {
        setPosts(response.data.posts);
      } else {
        throw new Error(response.data.error || 'Error al cargar posts');
      }
    } catch (error: any) {
      console.error('Error al cargar feed:', error);
      const errorMessage = error?.response?.data?.message || 'Error al cargar el feed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Loader size={48} />
        <p className="text-gray-600 mt-4">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadPosts}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 text-lg">No hay publicaciones aún</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

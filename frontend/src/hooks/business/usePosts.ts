'use client';

import { useState, useCallback } from 'react';
import { ServiceLocator } from '@/di/ServiceRegistry';
import { GetPostsUseCase, GetPostsRequest } from '@/domain/use-cases/posts/GetPostsUseCase';
import { CreatePostUseCase, CreatePostRequest } from '@/domain/use-cases/posts/CreatePostUseCase';
import { Post } from '@/domain/entities/Post';
import { User } from '@/types/auth';

interface UsePostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

/**
 * Custom hook for managing posts
 * Provides posts operations with business logic
 */
export const usePosts = () => {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    isLoading: false,
    error: null,
    hasMore: true,
    currentPage: 1
  });

  const [isCreating, setIsCreating] = useState(false);

  // Get posts with filters
  const getPosts = useCallback(async (request: GetPostsRequest, userId?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const postRepository = ServiceLocator.getPostRepository();
      const getPostsUseCase = new GetPostsUseCase(postRepository);
      
      const result = await getPostsUseCase.execute(request, userId);
      
      if (result.success && result.posts) {
        setState(prev => ({
          ...prev,
          posts: request.page === 1 ? result.posts! : [...prev.posts, ...result.posts!],
          isLoading: false,
          hasMore: result.pagination?.hasNext || false,
          currentPage: result.pagination?.page || 1
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Error al cargar posts'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error inesperado'
      }));
    }
  }, []);

  // Load more posts (pagination)
  const loadMore = useCallback(async (request: Omit<GetPostsRequest, 'page'>, userId?: string) => {
    if (!state.hasMore || state.isLoading) return;

    const nextPage = state.currentPage + 1;
    await getPosts({ ...request, page: nextPage }, userId);
  }, [state.hasMore, state.isLoading, state.currentPage, getPosts]);

  // Refresh posts (reload from page 1)
  const refresh = useCallback(async (request: Omit<GetPostsRequest, 'page'>, userId?: string) => {
    setState(prev => ({ ...prev, posts: [], currentPage: 1, hasMore: true }));
    await getPosts({ ...request, page: 1 }, userId);
  }, [getPosts]);

  // Create new post
  const createPost = useCallback(async (request: CreatePostRequest, author: User) => {
    setIsCreating(true);

    try {
      const postRepository = ServiceLocator.getPostRepository();
      const createPostUseCase = new CreatePostUseCase(postRepository);
      
      const result = await createPostUseCase.execute(request, author);
      
      if (result.success && result.post) {
        // Add new post to the beginning of the list
        setState(prev => ({
          ...prev,
          posts: [result.post!, ...prev.posts]
        }));
        
        setIsCreating(false);
        return { success: true, post: result.post, message: result.message };
      } else {
        setIsCreating(false);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      setIsCreating(false);
      return { success: false, error: error.message || 'Error al crear post' };
    }
  }, []);

  // Update post in local state
  const updatePostInState = useCallback((postId: string, updates: Partial<Post>) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          // Create new Post instance with updates
          return new Post(
            post.id,
            updates.content || post.content,
            updates.author || post.author,
            updates.createdAt || post.createdAt,
            updates.updatedAt || post.updatedAt,
            updates.imageUrl !== undefined ? updates.imageUrl : post.imageUrl,
            updates.tags || post.tags
          );
        }
        return post;
      })
    }));
  }, []);

  // Remove post from local state
  const removePostFromState = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== postId)
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear all posts
  const clearPosts = useCallback(() => {
    setState({
      posts: [],
      isLoading: false,
      error: null,
      hasMore: true,
      currentPage: 1
    });
  }, []);

  return {
    // State
    posts: state.posts,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    currentPage: state.currentPage,
    isCreating,

    // Actions
    getPosts,
    loadMore,
    refresh,
    createPost,
    updatePostInState,
    removePostFromState,
    clearError,
    clearPosts,
  };
};
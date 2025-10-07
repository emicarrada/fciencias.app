'use client';

import { useState, useCallback } from 'react';
import { ServiceLocator } from '@/di/ServiceRegistry';
import { ReactToPostUseCase, ReactToPostRequest } from '@/domain/use-cases/posts/ReactToPostUseCase';
import { ReactionType, ReactionSummary } from '@/domain/value-objects/Reaction';

interface UseReactionsState {
  reactionSummaries: Map<string, ReactionSummary>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing post reactions
 * Provides reactions operations with business logic
 */
export const useReactions = () => {
  const [state, setState] = useState<UseReactionsState>({
    reactionSummaries: new Map(),
    isLoading: false,
    error: null
  });

  const [reactingPosts, setReactingPosts] = useState<Set<string>>(new Set());

  // Get reaction summaries for multiple posts
  const getReactionSummaries = useCallback(async (postIds: string[], userId?: string) => {
    if (postIds.length === 0) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const reactionRepository = ServiceLocator.getReactionRepository();
      const summaries = await reactionRepository.getPostsSummaries(postIds, userId);
      
      setState(prev => ({
        ...prev,
        reactionSummaries: new Map([...prev.reactionSummaries, ...summaries]),
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al cargar reacciones'
      }));
    }
  }, []);

  // Get reaction summary for a single post
  const getPostReactionSummary = useCallback(async (postId: string, userId?: string) => {
    try {
      const reactionRepository = ServiceLocator.getReactionRepository();
      const summary = await reactionRepository.getPostSummary(postId, userId);
      
      setState(prev => ({
        ...prev,
        reactionSummaries: new Map(prev.reactionSummaries.set(postId, summary))
      }));
      
      return summary;
    } catch (error: any) {
      console.error('Error getting post reaction summary:', error);
      return null;
    }
  }, []);

  // React to a post
  const reactToPost = useCallback(async (
    postId: string, 
    reactionType: ReactionType, 
    userId: string
  ) => {
    // Prevent multiple simultaneous reactions to the same post
    if (reactingPosts.has(postId)) return { success: false, error: 'Reacción en proceso' };

    setReactingPosts(prev => new Set(prev).add(postId));

    try {
      const reactionRepository = ServiceLocator.getReactionRepository();
      const reactToPostUseCase = new ReactToPostUseCase(reactionRepository);
      
      const request: ReactToPostRequest = { postId, reactionType };
      const result = await reactToPostUseCase.execute(request, userId);
      
      if (result.success) {
        // Update local reaction summary
        await getPostReactionSummary(postId, userId);
      }
      
      setReactingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      
      return result;
    } catch (error: any) {
      setReactingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      
      return { 
        success: false, 
        error: error.message || 'Error al procesar reacción' 
      };
    }
  }, [reactingPosts, getPostReactionSummary]);

  // Get reaction summary for a post from state
  const getPostSummary = useCallback((postId: string): ReactionSummary | null => {
    return state.reactionSummaries.get(postId) || null;
  }, [state.reactionSummaries]);

  // Check if user has reacted to a post
  const hasUserReacted = useCallback((postId: string): boolean => {
    const summary = state.reactionSummaries.get(postId);
    return summary?.hasUserReacted() || false;
  }, [state.reactionSummaries]);

  // Get user's reaction to a post
  const getUserReaction = useCallback((postId: string): ReactionType | null => {
    const summary = state.reactionSummaries.get(postId);
    return summary?.userReaction || null;
  }, [state.reactionSummaries]);

  // Get total reactions count for a post
  const getTotalReactions = useCallback((postId: string): number => {
    const summary = state.reactionSummaries.get(postId);
    return summary?.totalCount || 0;
  }, [state.reactionSummaries]);

  // Get reaction count for specific type
  const getReactionCount = useCallback((postId: string, type: ReactionType): number => {
    const summary = state.reactionSummaries.get(postId);
    return summary?.getCount(type) || 0;
  }, [state.reactionSummaries]);

  // Check if post is being reacted to
  const isReacting = useCallback((postId: string): boolean => {
    return reactingPosts.has(postId);
  }, [reactingPosts]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear all reactions
  const clearReactions = useCallback(() => {
    setState({
      reactionSummaries: new Map(),
      isLoading: false,
      error: null
    });
    setReactingPosts(new Set());
  }, []);

  // Update reaction summary locally (optimistic update)
  const updateReactionSummaryOptimistic = useCallback((
    postId: string, 
    newType: ReactionType | null, 
    oldType: ReactionType | null
  ) => {
    setState(prev => {
      const currentSummary = prev.reactionSummaries.get(postId);
      if (!currentSummary) return prev;

      const newReactions = new Map(currentSummary.reactions);
      let newTotal = currentSummary.totalCount;

      // Remove old reaction
      if (oldType) {
        const oldCount = newReactions.get(oldType) || 0;
        newReactions.set(oldType, Math.max(0, oldCount - 1));
        newTotal = Math.max(0, newTotal - 1);
      }

      // Add new reaction
      if (newType) {
        const newCount = newReactions.get(newType) || 0;
        newReactions.set(newType, newCount + 1);
        newTotal += 1;
      }

      const newSummary = new ReactionSummary(
        postId,
        newReactions,
        newTotal,
        newType || undefined
      );

      const newSummaries = new Map(prev.reactionSummaries);
      newSummaries.set(postId, newSummary);

      return {
        ...prev,
        reactionSummaries: newSummaries
      };
    });
  }, []);

  return {
    // State
    reactionSummaries: state.reactionSummaries,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    getReactionSummaries,
    getPostReactionSummary,
    reactToPost,
    
    // Getters
    getPostSummary,
    hasUserReacted,
    getUserReaction,
    getTotalReactions,
    getReactionCount,
    isReacting,
    
    // Utils
    clearError,
    clearReactions,
    updateReactionSummaryOptimistic,
  };
};
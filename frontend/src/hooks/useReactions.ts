import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type ReactionType = 'like' | 'love' | 'interesting' | 'useful' | 'relevant' | 'mind-blown' | 'brilliant';

interface ReactionData {
  count: number;
  isActive: boolean;
}

interface UseReactionsProps {
  contentId: string;
  contentType: 'announcement' | 'event' | 'comment';
  initialReactions?: Record<ReactionType, ReactionData>;
  userId?: string;
}

interface ReactionApiResponse {
  success: boolean;
  reactions: Record<ReactionType, ReactionData>;
}

// Mock API function - replace with actual API call
const updateReaction = async (
  contentId: string,
  contentType: string,
  reactionType: ReactionType,
  isActive: boolean
): Promise<ReactionApiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Mock response
  return {
    success: true,
    reactions: {
      like: { count: Math.floor(Math.random() * 50), isActive: false },
      love: { count: Math.floor(Math.random() * 30), isActive: false },
      interesting: { count: Math.floor(Math.random() * 20), isActive: false },
      useful: { count: Math.floor(Math.random() * 25), isActive: false },
      relevant: { count: Math.floor(Math.random() * 15), isActive: false },
      'mind-blown': { count: Math.floor(Math.random() * 10), isActive: false },
      brilliant: { count: Math.floor(Math.random() * 12), isActive: false },
      [reactionType]: { 
        count: Math.floor(Math.random() * 50) + (isActive ? 1 : 0), 
        isActive 
      },
    },
  };
};

export const useReactions = ({
  contentId,
  contentType,
  initialReactions = {
    like: { count: 0, isActive: false },
    love: { count: 0, isActive: false },
    interesting: { count: 0, isActive: false },
    useful: { count: 0, isActive: false },
    relevant: { count: 0, isActive: false },
    'mind-blown': { count: 0, isActive: false },
    brilliant: { count: 0, isActive: false },
  },
  userId,
}: UseReactionsProps) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<ReactionType, boolean>>(new Map());
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ reactionType, newState }: { reactionType: ReactionType; newState: boolean }) => {
      return updateReaction(contentId, contentType, reactionType, newState);
    },
    onMutate: async ({ reactionType, newState }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['reactions', contentId] });

      // Snapshot the previous value
      const previousReactions = reactions;

      // Optimistically update the UI
      setOptimisticUpdates(prev => new Map(prev).set(reactionType, newState));
      
      setReactions(prev => ({
        ...prev,
        [reactionType]: {
          count: newState ? prev[reactionType].count + 1 : prev[reactionType].count - 1,
          isActive: newState,
        },
      }));

      return { previousReactions };
    },
    onError: (err, { reactionType }, context) => {
      // Revert on error
      if (context?.previousReactions) {
        setReactions(context.previousReactions);
      }
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(reactionType);
        return newMap;
      });
      console.error('Error updating reaction:', err);
    },
    onSuccess: (data, { reactionType }) => {
      // Update with server response
      setReactions(data.reactions);
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(reactionType);
        return newMap;
      });
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['reactions', contentId] });
    },
  });

  const handleReaction = useCallback((reactionType: ReactionType) => {
    if (!userId) {
      // Handle unauthenticated user - maybe show login modal
      console.warn('User must be logged in to react');
      return;
    }

    const currentState = reactions[reactionType].isActive;
    const newState = !currentState;

    // Prevent spam clicking
    if (mutation.isPending) {
      return;
    }

    mutation.mutate({ reactionType, newState });
  }, [reactions, mutation, userId]);

  // Calculate total reactions
  const totalReactions = useMemo(() => {
    return Object.values(reactions).reduce((sum, reaction) => sum + reaction.count, 0);
  }, [reactions]);

  // Get most popular reaction
  const mostPopularReaction = useMemo(() => {
    return Object.entries(reactions).reduce((max, [type, data]) => 
      data.count > max.count ? { type: type as ReactionType, count: data.count } : max,
      { type: 'like' as ReactionType, count: 0 }
    );
  }, [reactions]);

  // Check if user has reacted
  const hasUserReacted = useMemo(() => {
    return Object.values(reactions).some(reaction => reaction.isActive);
  }, [reactions]);

  return {
    reactions,
    handleReaction,
    isLoading: mutation.isPending,
    error: mutation.error,
    totalReactions,
    mostPopularReaction,
    hasUserReacted,
    isOptimistic: (reactionType: ReactionType) => optimisticUpdates.has(reactionType),
  };
};

export default useReactions;

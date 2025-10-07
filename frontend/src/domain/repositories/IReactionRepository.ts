import { IRepository } from './IRepository';
import { Reaction, ReactionType, ReactionSummary } from '../value-objects/Reaction';

/**
 * Repository interface for Reaction entity
 */
export interface IReactionRepository extends IRepository<Reaction> {
  /**
   * Get reactions for a specific post
   */
  findByPost(postId: string): Promise<Reaction[]>;
  
  /**
   * Get user's reaction to a specific post
   */
  findUserReaction(postId: string, userId: string): Promise<Reaction | null>;
  
  /**
   * Get reactions by user
   */
  findByUser(userId: string): Promise<Reaction[]>;
  
  /**
   * Get reaction summary for a post
   */
  getPostSummary(postId: string, userId?: string): Promise<ReactionSummary>;
  
  /**
   * Get reaction summaries for multiple posts
   */
  getPostsSummaries(postIds: string[], userId?: string): Promise<Map<string, ReactionSummary>>;
  
  /**
   * Add or update user's reaction to a post
   */
  reactToPost(postId: string, userId: string, type: ReactionType): Promise<Reaction>;
  
  /**
   * Remove user's reaction from a post
   */
  removeReaction(postId: string, userId: string): Promise<void>;
  
  /**
   * Get most reacted posts in date range
   */
  getMostReactedPosts(startDate: Date, endDate: Date, limit?: number): Promise<PostReactionStats[]>;
  
  /**
   * Get reaction statistics for a user
   */
  getUserStats(userId: string): Promise<UserReactionStats>;
  
  /**
   * Get trending reaction types
   */
  getTrendingReactionTypes(days?: number): Promise<ReactionTypeStats[]>;
}

/**
 * Post reaction statistics
 */
export interface PostReactionStats {
  postId: string;
  totalReactions: number;
  reactionsByType: Record<ReactionType, number>;
  score: number;
}

/**
 * User reaction statistics
 */
export interface UserReactionStats {
  userId: string;
  totalReactionsGiven: number;
  totalReactionsReceived: number;
  favoriteReactionType: ReactionType;
  reactionsByType: Record<ReactionType, number>;
}

/**
 * Reaction type statistics
 */
export interface ReactionTypeStats {
  type: ReactionType;
  count: number;
  percentage: number;
}
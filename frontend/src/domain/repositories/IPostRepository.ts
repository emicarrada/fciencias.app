import { IRepository, PaginatedResult, QueryOptions } from './IRepository';
import { Post } from '../entities/Post';
import { User } from '@/types/auth';

/**
 * Repository interface for Post entity
 * Extends base repository with post-specific operations
 */
export interface IPostRepository extends IRepository<Post, string, CreatePostData, UpdatePostData> {
  /**
   * Get posts by author
   */
  findByAuthor(authorId: string, options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get posts by tags
   */
  findByTags(tags: string[], options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get posts from followed users
   */
  findFromFollowedUsers(userId: string, options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get trending posts (by engagement)
   */
  findTrending(options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Search posts by content
   */
  search(query: string, options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get posts with most reactions
   */
  findMostReacted(options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get recent posts from user's career
   */
  findByCareer(career: string, options?: QueryOptions): Promise<PaginatedResult<Post>>;
  
  /**
   * Get posts created in date range
   */
  findInDateRange(
    startDate: Date, 
    endDate: Date, 
    options?: QueryOptions
  ): Promise<PaginatedResult<Post>>;
  
  /**
   * Get post with reactions count
   */
  findWithReactions(postId: string): Promise<PostWithReactions | null>;
  
  /**
   * Get user's draft posts
   */
  findDrafts(userId: string, options?: QueryOptions): Promise<PaginatedResult<Post>>;
}

/**
 * Post with reactions data
 */
export interface PostWithReactions {
  post: Post;
  reactions: {
    total: number;
    byType: Record<string, number>;
    userReaction?: string;
  };
}

/**
 * Post creation data
 */
export interface CreatePostData {
  content: string;
  authorId: string;
  imageUrl?: string;
  tags?: string[];
  isDraft?: boolean;
}

/**
 * Post update data
 */
export interface UpdatePostData {
  content?: string;
  imageUrl?: string;
  tags?: string[];
  isDraft?: boolean;
}
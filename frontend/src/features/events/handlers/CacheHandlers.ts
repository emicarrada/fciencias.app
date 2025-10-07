import type { EventHandler } from '../infrastructure/EventBusInterfaces';
import type { 
  PostCreatedEvent, 
  PostUpdatedEvent,
  PostDeletedEvent 
} from '../domain/PostEvents';
import type { 
  PostReactionAddedEvent, 
  PostReactionChangedEvent,
  PostReactionRemovedEvent,
  PostReactionSummaryUpdatedEvent 
} from '../domain/ReactionEvents';
import type { 
  UserProfileUpdatedEvent,
  UserFollowedEvent,
  UserUnfollowedEvent 
} from '../domain/UserEvents';

/**
 * Cache service interface
 */
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * Cache entry interface
 */
interface CacheEntry<T = any> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

/**
 * In-memory cache service for demo purposes
 */
class InMemoryCacheService implements ICacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTTL): Promise<void> {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      expiresAt: now + (ttlSeconds * 1000),
      createdAt: now,
    };

    this.cache.set(key, entry);
    console.log(`[Cache] Set: ${key} (TTL: ${ttlSeconds}s)`);
  }

  async delete(key: string): Promise<void> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`[Cache] Deleted: ${key}`);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    // Simple pattern matching with wildcards
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    console.log(`[Cache] Deleted pattern: ${pattern} (${keysToDelete.length} keys)`);
  }

  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[Cache] Cleared all entries (${size} keys)`);
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Utility methods for debugging
  getStats(): {
    totalKeys: number;
    expiredKeys: number;
    totalSize: number;
    hitRate: number;
  } {
    const now = Date.now();
    let expiredKeys = 0;
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expiredKeys++;
      }
      totalSize += JSON.stringify(entry.value).length;
    }

    return {
      totalKeys: this.cache.size,
      expiredKeys,
      totalSize,
      hitRate: 0, // Would track hits/misses for real hit rate
    };
  }

  getAllKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * Global cache service instance
 */
const cacheService = new InMemoryCacheService();

/**
 * Cache key generators
 */
export const CacheKeys = {
  userPosts: (userId: string) => `posts:user:${userId}`,
  userProfile: (userId: string) => `profile:${userId}`,
  post: (postId: string) => `post:${postId}`,
  postReactions: (postId: string) => `reactions:${postId}`,
  userFollowers: (userId: string) => `followers:${userId}`,
  userFollowing: (userId: string) => `following:${userId}`,
  feedPosts: (userId: string) => `feed:${userId}`,
  trendingPosts: () => 'posts:trending',
  popularPosts: (timeframe: string) => `posts:popular:${timeframe}`,
  searchResults: (query: string) => `search:${query.toLowerCase()}`,
  postsByTag: (tag: string) => `posts:tag:${tag}`,
  postsByCareer: (career: string) => `posts:career:${career}`,
};

/**
 * Handler for post creation cache invalidation
 */
export const PostCreatedCacheHandler: EventHandler<PostCreatedEvent> = async (event) => {
  try {
    const { authorId, tags } = event.data;

    // Invalidate author's posts cache
    await cacheService.delete(CacheKeys.userPosts(authorId));

    // Invalidate feed caches for author's followers
    // In real app, you'd get followers list and invalidate their feeds
    await cacheService.deletePattern('feed:*');

    // Invalidate trending and popular posts
    await cacheService.delete(CacheKeys.trendingPosts());
    await cacheService.deletePattern('posts:popular:*');

    // Invalidate tag-based caches
    for (const tag of tags) {
      await cacheService.delete(CacheKeys.postsByTag(tag));
    }

    // Invalidate search results (broad invalidation)
    await cacheService.deletePattern('search:*');

    console.log(`[PostCreatedCacheHandler] Invalidated cache for new post by user ${authorId}`);
  } catch (error) {
    console.error('[PostCreatedCacheHandler] Error:', error);
  }
};

/**
 * Handler for post update cache invalidation
 */
export const PostUpdatedCacheHandler: EventHandler<PostUpdatedEvent> = async (event) => {
  try {
    const { postId, authorId, changedFields, newTags, previousTags } = event.data;

    // Invalidate specific post cache
    await cacheService.delete(CacheKeys.post(postId));

    // Invalidate author's posts cache
    await cacheService.delete(CacheKeys.userPosts(authorId));

    // If content or tags changed, invalidate more caches
    if (changedFields.includes('content') || changedFields.includes('tags')) {
      await cacheService.deletePattern('feed:*');
      await cacheService.delete(CacheKeys.trendingPosts());
      
      // Invalidate old and new tag caches
      const allTags = [...new Set([...previousTags, ...newTags])];
      for (const tag of allTags) {
        await cacheService.delete(CacheKeys.postsByTag(tag));
      }

      // Invalidate search results
      await cacheService.deletePattern('search:*');
    }

    console.log(`[PostUpdatedCacheHandler] Invalidated cache for updated post ${postId}`);
  } catch (error) {
    console.error('[PostUpdatedCacheHandler] Error:', error);
  }
};

/**
 * Handler for post deletion cache invalidation
 */
export const PostDeletedCacheHandler: EventHandler<PostDeletedEvent> = async (event) => {
  try {
    const { postId, authorId, tags } = event.data;

    // Remove specific post from cache
    await cacheService.delete(CacheKeys.post(postId));
    await cacheService.delete(CacheKeys.postReactions(postId));

    // Invalidate author's posts cache
    await cacheService.delete(CacheKeys.userPosts(authorId));

    // Invalidate all feeds (post might be in many feeds)
    await cacheService.deletePattern('feed:*');

    // Invalidate trending and popular posts
    await cacheService.delete(CacheKeys.trendingPosts());
    await cacheService.deletePattern('posts:popular:*');

    // Invalidate tag-based caches
    for (const tag of tags) {
      await cacheService.delete(CacheKeys.postsByTag(tag));
    }

    // Invalidate search results
    await cacheService.deletePattern('search:*');

    console.log(`[PostDeletedCacheHandler] Invalidated cache for deleted post ${postId}`);
  } catch (error) {
    console.error('[PostDeletedCacheHandler] Error:', error);
  }
};

/**
 * Handler for reaction cache updates
 */
export const ReactionCacheHandler: EventHandler<PostReactionAddedEvent | PostReactionChangedEvent | PostReactionRemovedEvent> = async (event) => {
  try {
    const { postId, authorId } = event.data;

    // Invalidate post reactions cache
    await cacheService.delete(CacheKeys.postReactions(postId));

    // Invalidate the specific post cache (reaction counts changed)
    await cacheService.delete(CacheKeys.post(postId));

    // Invalidate trending posts (reaction count affects trending)
    await cacheService.delete(CacheKeys.trendingPosts());
    await cacheService.deletePattern('posts:popular:*');

    // Invalidate author's posts cache (reaction counts updated)
    await cacheService.delete(CacheKeys.userPosts(authorId));

    console.log(`[ReactionCacheHandler] Invalidated cache for post reaction ${postId}`);
  } catch (error) {
    console.error('[ReactionCacheHandler] Error:', error);
  }
};

/**
 * Handler for reaction summary cache updates
 */
export const ReactionSummaryCacheHandler: EventHandler<PostReactionSummaryUpdatedEvent> = async (event) => {
  try {
    const { postId, authorId } = event.data;

    // Update reaction summary cache with new data
    await cacheService.set(CacheKeys.postReactions(postId), event.data, 1800); // 30 minutes

    // Update post cache with new reaction data
    const cachedPost = await cacheService.get(CacheKeys.post(postId));
    if (cachedPost) {
      // Update the cached post with new reaction summary
      await cacheService.set(CacheKeys.post(postId), {
        ...cachedPost,
        reactionSummary: event.data,
        updatedAt: new Date()
      });
    }

    console.log(`[ReactionSummaryCacheHandler] Updated reaction summary cache for post ${postId}`);
  } catch (error) {
    console.error('[ReactionSummaryCacheHandler] Error:', error);
  }
};

/**
 * Handler for user profile cache invalidation
 */
export const UserProfileCacheHandler: EventHandler<UserProfileUpdatedEvent> = async (event) => {
  try {
    const { userId } = event.data;

    // Invalidate user profile cache
    await cacheService.delete(CacheKeys.userProfile(userId));

    // Invalidate user's posts cache (profile info might be embedded)
    await cacheService.delete(CacheKeys.userPosts(userId));

    // Invalidate feeds where this user's posts appear
    await cacheService.deletePattern('feed:*');

    console.log(`[UserProfileCacheHandler] Invalidated cache for user profile ${userId}`);
  } catch (error) {
    console.error('[UserProfileCacheHandler] Error:', error);
  }
};

/**
 * Handler for follow relationship cache invalidation
 */
export const FollowCacheHandler: EventHandler<UserFollowedEvent | UserUnfollowedEvent> = async (event) => {
  try {
    const { followerId } = event.data;
    
    // Handle different event types
    let targetUserId: string;
    if (event.eventType === 'UserFollowed') {
      targetUserId = (event.data as any).followedId;
    } else {
      targetUserId = (event.data as any).unfollowedId;
    }

    // Invalidate follower/following caches
    await cacheService.delete(CacheKeys.userFollowers(targetUserId));
    await cacheService.delete(CacheKeys.userFollowing(followerId));

    // Invalidate follower's feed (now includes/excludes followed user's posts)
    await cacheService.delete(CacheKeys.feedPosts(followerId));

    console.log(`[FollowCacheHandler] Invalidated cache for follow relationship ${followerId} -> ${targetUserId}`);
  } catch (error) {
    console.error('[FollowCacheHandler] Error:', error);
  }
};

/**
 * Preload cache handler for popular content
 */
export const PreloadCacheHandler: EventHandler<PostCreatedEvent> = async (event) => {
  try {
    const { postId, authorId } = event.data;

    // Preload author profile in cache (likely to be viewed)
    // In real app, you'd fetch from database and cache
    console.log(`[PreloadCacheHandler] Would preload author profile for ${authorId}`);

    // Preload related posts by same author
    console.log(`[PreloadCacheHandler] Would preload related posts for author ${authorId}`);

    // Cache the new post immediately (warm cache)
    console.log(`[PreloadCacheHandler] Would cache new post ${postId}`);
  } catch (error) {
    console.error('[PreloadCacheHandler] Error:', error);
  }
};

/**
 * Export cache service for testing and debugging
 */
export { cacheService };

/**
 * Utility to register all cache handlers
 */
export function registerCacheHandlers(eventBus: any) {
  // Post events
  eventBus.subscribe('PostCreated', PostCreatedCacheHandler);
  eventBus.subscribe('PostCreated', PreloadCacheHandler);
  eventBus.subscribe('PostUpdated', PostUpdatedCacheHandler);
  eventBus.subscribe('PostDeleted', PostDeletedCacheHandler);

  // Reaction events
  eventBus.subscribe('PostReactionAdded', ReactionCacheHandler);
  eventBus.subscribe('PostReactionChanged', ReactionCacheHandler);
  eventBus.subscribe('PostReactionRemoved', ReactionCacheHandler);
  eventBus.subscribe('PostReactionSummaryUpdated', ReactionSummaryCacheHandler);

  // User events
  eventBus.subscribe('UserProfileUpdated', UserProfileCacheHandler);
  eventBus.subscribe('UserFollowed', FollowCacheHandler);
  eventBus.subscribe('UserUnfollowed', FollowCacheHandler);

  console.log('[CacheHandlers] All cache handlers registered');
}
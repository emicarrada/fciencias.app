import type { EventHandler } from '../infrastructure/EventBusInterfaces';
import type { 
  PostCreatedEvent, 
  PostUpdatedEvent,
  PostDeletedEvent, 
  PostViewedEvent,
  PostSharedEvent 
} from '../domain/PostEvents';
import type { 
  PostReactionAddedEvent, 
  PostReactionChangedEvent,
  PostReactionRemovedEvent,
  PostReactionMilestoneEvent 
} from '../domain/ReactionEvents';
import type { 
  UserRegisteredEvent,
  UserLoggedInEvent,
  UserLoggedOutEvent,
  UserFollowedEvent,
  UserProfileUpdatedEvent 
} from '../domain/UserEvents';

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  timestamp: Date;
  source: 'web' | 'mobile' | 'api';
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Analytics service interface
 */
export interface IAnalyticsService {
  track(eventType: string, properties: Record<string, any>, userId?: string): Promise<void>;
  identify(userId: string, traits: Record<string, any>): Promise<void>;
  page(pageName: string, properties?: Record<string, any>, userId?: string): Promise<void>;
  group(groupId: string, traits: Record<string, any>, userId?: string): Promise<void>;
}

/**
 * In-memory analytics service for demo purposes
 */
class InMemoryAnalyticsService implements IAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private userProfiles: Map<string, Record<string, any>> = new Map();
  private sessionData: Map<string, Record<string, any>> = new Map();

  async track(eventType: string, properties: Record<string, any>, userId?: string): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      id: `analytics_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      eventType,
      userId,
      sessionId: this.getCurrentSessionId(),
      properties,
      timestamp: new Date(),
      source: 'web',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.events.push(analyticsEvent);
    
    console.log(`[Analytics] Tracked: ${eventType}`, properties);
  }

  async identify(userId: string, traits: Record<string, any>): Promise<void> {
    const existing = this.userProfiles.get(userId) || {};
    this.userProfiles.set(userId, { ...existing, ...traits, lastSeen: new Date() });
    
    console.log(`[Analytics] Identified user: ${userId}`, traits);
  }

  async page(pageName: string, properties: Record<string, any> = {}, userId?: string): Promise<void> {
    await this.track('page_view', {
      page: pageName,
      ...properties
    }, userId);
  }

  async group(groupId: string, traits: Record<string, any>, userId?: string): Promise<void> {
    await this.track('group_joined', {
      groupId,
      ...traits
    }, userId);
  }

  // Utility methods for debugging and testing
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(e => e.eventType === eventType);
  }

  getEventsForUser(userId: string): AnalyticsEvent[] {
    return this.events.filter(e => e.userId === userId);
  }

  getUserProfile(userId: string): Record<string, any> | undefined {
    return this.userProfiles.get(userId);
  }

  getStats(): {
    totalEvents: number;
    uniqueUsers: number;
    eventsByType: Record<string, number>;
    topEvents: Array<{ event: string; count: number }>;
  } {
    const eventsByType: Record<string, number> = {};
    const uniqueUsers = new Set<string>();

    for (const event of this.events) {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      if (event.userId) {
        uniqueUsers.add(event.userId);
      }
    }

    const topEvents = Object.entries(eventsByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));

    return {
      totalEvents: this.events.length,
      uniqueUsers: uniqueUsers.size,
      eventsByType,
      topEvents
    };
  }

  clear(): void {
    this.events = [];
    this.userProfiles.clear();
    this.sessionData.clear();
  }

  private getCurrentSessionId(): string {
    // Simple session ID generation
    return `session_${Date.now()}`;
  }
}

/**
 * Global analytics service instance
 */
const analyticsService = new InMemoryAnalyticsService();

/**
 * Handler for post creation analytics
 */
export const PostCreatedAnalyticsHandler: EventHandler<PostCreatedEvent> = async (event) => {
  try {
    const { postId, authorId, content, tags } = event.data;

    await analyticsService.track('post_created', {
      postId,
      contentLength: content.length,
      tagCount: tags.length,
      tags,
      hasImage: false, // Would check for imageUrl
      createdAt: event.occurredAt,
    }, authorId);

    // Track user engagement
    await analyticsService.identify(authorId, {
      lastPostCreated: event.occurredAt,
      totalPosts: 1, // Would increment from existing count
    });

    console.log(`[PostCreatedAnalyticsHandler] Tracked post creation: ${postId}`);
  } catch (error) {
    console.error('[PostCreatedAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for post view analytics
 */
export const PostViewedAnalyticsHandler: EventHandler<PostViewedEvent> = async (event) => {
  try {
    const { postId, viewerId, authorId, source, viewDuration } = event.data;

    await analyticsService.track('post_viewed', {
      postId,
      authorId,
      source,
      viewDuration,
      isOwnPost: viewerId === authorId,
      viewedAt: event.occurredAt,
    }, viewerId);

    console.log(`[PostViewedAnalyticsHandler] Tracked post view: ${postId} by ${viewerId}`);
  } catch (error) {
    console.error('[PostViewedAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for reaction analytics
 */
export const ReactionAnalyticsHandler: EventHandler<PostReactionAddedEvent> = async (event) => {
  try {
    const { postId, authorId, userId, reactionType, reactionWeight } = event.data;

    await analyticsService.track('post_reaction', {
      postId,
      authorId,
      reactionType,
      reactionWeight,
      isOwnPost: authorId === userId,
      reactedAt: event.occurredAt,
    }, userId);

    // Track engagement metrics
    await analyticsService.identify(userId, {
      lastReaction: event.occurredAt,
      totalReactions: 1, // Would increment from existing count
    });

    console.log(`[ReactionAnalyticsHandler] Tracked reaction: ${reactionType} by ${userId}`);
  } catch (error) {
    console.error('[ReactionAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for user registration analytics
 */
export const UserRegistrationAnalyticsHandler: EventHandler<UserRegisteredEvent> = async (event) => {
  try {
    const { userId, email, firstName, lastName, career, registrationMethod } = event.data;

    await analyticsService.track('user_registered', {
      registrationMethod,
      career,
      hasCareer: !!career,
      registeredAt: event.occurredAt,
    }, userId);

    await analyticsService.identify(userId, {
      email,
      firstName,
      lastName,
      career,
      registrationMethod,
      registeredAt: event.occurredAt,
      status: 'active',
    });

    console.log(`[UserRegistrationAnalyticsHandler] Tracked registration: ${userId}`);
  } catch (error) {
    console.error('[UserRegistrationAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for user login analytics
 */
export const UserLoginAnalyticsHandler: EventHandler<UserLoggedInEvent> = async (event) => {
  try {
    const { userId, loginMethod, sessionId, previousLoginAt } = event.data;

    const daysSinceLastLogin = previousLoginAt 
      ? Math.floor((event.occurredAt.getTime() - previousLoginAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    await analyticsService.track('user_login', {
      loginMethod,
      sessionId,
      daysSinceLastLogin,
      isReturningUser: !!previousLoginAt,
      loginAt: event.occurredAt,
    }, userId);

    await analyticsService.identify(userId, {
      lastLogin: event.occurredAt,
      loginMethod,
      sessionId,
    });

    console.log(`[UserLoginAnalyticsHandler] Tracked login: ${userId} via ${loginMethod}`);
  } catch (error) {
    console.error('[UserLoginAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for user logout analytics
 */
export const UserLogoutAnalyticsHandler: EventHandler<UserLoggedOutEvent> = async (event) => {
  try {
    const { userId, sessionDuration, logoutReason } = event.data;

    await analyticsService.track('user_logout', {
      sessionDuration,
      logoutReason,
      logoutAt: event.occurredAt,
    }, userId);

    console.log(`[UserLogoutAnalyticsHandler] Tracked logout: ${userId} after ${sessionDuration}ms`);
  } catch (error) {
    console.error('[UserLogoutAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for follow analytics
 */
export const FollowAnalyticsHandler: EventHandler<UserFollowedEvent> = async (event) => {
  try {
    const { followerId, followedId } = event.data;

    await analyticsService.track('user_followed', {
      followedId,
      followedAt: event.occurredAt,
    }, followerId);

    // Update follower metrics
    await analyticsService.identify(followerId, {
      lastFollow: event.occurredAt,
      totalFollowing: 1, // Would increment from existing count
    });

    // Update followed user metrics
    await analyticsService.identify(followedId, {
      totalFollowers: 1, // Would increment from existing count
    });

    console.log(`[FollowAnalyticsHandler] Tracked follow: ${followerId} -> ${followedId}`);
  } catch (error) {
    console.error('[FollowAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for post sharing analytics
 */
export const PostSharedAnalyticsHandler: EventHandler<PostSharedEvent> = async (event) => {
  try {
    const { postId, sharedBy, authorId, shareMethod, platform } = event.data;

    await analyticsService.track('post_shared', {
      postId,
      authorId,
      shareMethod,
      platform,
      isOwnPost: sharedBy === authorId,
      sharedAt: event.occurredAt,
    }, sharedBy);

    console.log(`[PostSharedAnalyticsHandler] Tracked share: ${postId} via ${shareMethod}`);
  } catch (error) {
    console.error('[PostSharedAnalyticsHandler] Error:', error);
  }
};

/**
 * Handler for milestone analytics
 */
export const MilestoneAnalyticsHandler: EventHandler<PostReactionMilestoneEvent> = async (event) => {
  try {
    const { postId, authorId, milestone, milestoneType, totalReactions } = event.data;

    await analyticsService.track('milestone_reached', {
      postId,
      milestone,
      milestoneType,
      totalReactions,
      achievedAt: event.occurredAt,
    }, authorId);

    // Update author achievements
    await analyticsService.identify(authorId, {
      [`milestone_${milestoneType}`]: event.occurredAt,
      highestMilestone: milestone,
    });

    console.log(`[MilestoneAnalyticsHandler] Tracked milestone: ${milestoneType} for post ${postId}`);
  } catch (error) {
    console.error('[MilestoneAnalyticsHandler] Error:', error);
  }
};

/**
 * Export analytics service for testing and debugging
 */
export { analyticsService };

/**
 * Utility to register all analytics handlers
 */
export function registerAnalyticsHandlers(eventBus: any) {
  // Post events
  eventBus.subscribe('PostCreated', PostCreatedAnalyticsHandler);
  eventBus.subscribe('PostViewed', PostViewedAnalyticsHandler);
  eventBus.subscribe('PostShared', PostSharedAnalyticsHandler);

  // Reaction events
  eventBus.subscribe('PostReactionAdded', ReactionAnalyticsHandler);
  eventBus.subscribe('PostReactionMilestone', MilestoneAnalyticsHandler);

  // User events
  eventBus.subscribe('UserRegistered', UserRegistrationAnalyticsHandler);
  eventBus.subscribe('UserLoggedIn', UserLoginAnalyticsHandler);
  eventBus.subscribe('UserLoggedOut', UserLogoutAnalyticsHandler);
  eventBus.subscribe('UserFollowed', FollowAnalyticsHandler);

  console.log('[AnalyticsHandlers] All analytics handlers registered');
}
import type { EventHandler } from '../infrastructure/EventBusInterfaces';
import type { 
  PostCreatedEvent, 
  PostDeletedEvent, 
  PostViewedEvent,
  PostSharedEvent 
} from '../domain/PostEvents';
import type { 
  PostReactionAddedEvent, 
  PostReactionMilestoneEvent 
} from '../domain/ReactionEvents';
import type { 
  UserFollowedEvent, 
  UserRegisteredEvent 
} from '../domain/UserEvents';

/**
 * Base notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'post_created' | 'post_reaction' | 'user_followed' | 'milestone' | 'welcome';
  title: string;
  message: string;
  data: Record<string, any>;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}

/**
 * Notification service interface
 */
export interface INotificationService {
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void>;
  sendPushNotification?(userId: string, title: string, message: string, data?: Record<string, any>): Promise<void>;
  sendEmailNotification?(userId: string, subject: string, content: string): Promise<void>;
}

/**
 * In-memory notification service for demo purposes
 */
class InMemoryNotificationService implements INotificationService {
  private notifications: Notification[] = [];

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      createdAt: new Date(),
      read: false,
    };

    this.notifications.push(newNotification);
    
    console.log(`[Notification] Created: ${newNotification.title} for user ${newNotification.userId}`);
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getNotificationsForUser(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  clear(): void {
    this.notifications = [];
  }
}

/**
 * Global notification service instance
 */
const notificationService = new InMemoryNotificationService();

/**
 * Handler for post creation notifications
 * Notifies followers when someone they follow creates a post
 */
export const PostCreatedNotificationHandler: EventHandler<PostCreatedEvent> = async (event) => {
  try {
    const { postId, authorId, content } = event.data;
    
    // In a real app, you would:
    // 1. Get followers of the author from database
    // 2. Create notifications for each follower
    // For demo, we'll create a sample notification
    
    const contentPreview = content.length > 50 
      ? `${content.substring(0, 50)}...` 
      : content;

    // Sample notification for demo (in real app, iterate through followers)
    await notificationService.createNotification({
      userId: 'follower_sample_id', // Would be actual follower IDs
      type: 'post_created',
      title: 'Nuevo post',
      message: `Alguien que sigues publicó: "${contentPreview}"`,
      data: {
        postId,
        authorId,
        eventId: event.eventId,
      },
      actionUrl: `/posts/${postId}`,
    });

    console.log(`[PostCreatedNotificationHandler] Processed post creation: ${postId}`);
  } catch (error) {
    console.error('[PostCreatedNotificationHandler] Error:', error);
  }
};

/**
 * Handler for reaction notifications
 * Notifies post author when someone reacts to their post
 */
export const PostReactionNotificationHandler: EventHandler<PostReactionAddedEvent> = async (event) => {
  try {
    const { postId, authorId, userId, reactionType } = event.data;
    
    // Don't notify if user reacted to their own post
    if (authorId === userId) {
      return;
    }

    const reactionEmojis = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      surprised: '😲',
      dislike: '👎'
    };

    await notificationService.createNotification({
      userId: authorId,
      type: 'post_reaction',
      title: 'Nueva reacción',
      message: `Alguien reaccionó ${reactionEmojis[reactionType]} a tu post`,
      data: {
        postId,
        reactorId: userId,
        reactionType,
        eventId: event.eventId,
      },
      actionUrl: `/posts/${postId}`,
    });

    console.log(`[PostReactionNotificationHandler] Processed reaction: ${reactionType} on post ${postId}`);
  } catch (error) {
    console.error('[PostReactionNotificationHandler] Error:', error);
  }
};

/**
 * Handler for milestone notifications
 * Notifies when posts reach reaction milestones
 */
export const PostMilestoneNotificationHandler: EventHandler<PostReactionMilestoneEvent> = async (event) => {
  try {
    const { postId, authorId, milestone, milestoneType } = event.data;

    const milestoneMessages = {
      first_reaction: '¡Tu post recibió su primera reacción! 🎉',
      ten_reactions: '¡Tu post alcanzó 10 reacciones! 🔥',
      hundred_reactions: '¡Tu post alcanzó 100 reacciones! 💯',
      thousand_reactions: '¡Tu post alcanzó 1000 reacciones! 🚀',
      viral: '¡Tu post se volvió viral! 🌟'
    };

    await notificationService.createNotification({
      userId: authorId,
      type: 'milestone',
      title: 'Milestone alcanzado',
      message: milestoneMessages[milestoneType],
      data: {
        postId,
        milestone,
        milestoneType,
        eventId: event.eventId,
      },
      actionUrl: `/posts/${postId}`,
    });

    console.log(`[PostMilestoneNotificationHandler] Processed milestone: ${milestoneType} for post ${postId}`);
  } catch (error) {
    console.error('[PostMilestoneNotificationHandler] Error:', error);
  }
};

/**
 * Handler for follow notifications
 * Notifies when someone follows a user
 */
export const UserFollowNotificationHandler: EventHandler<UserFollowedEvent> = async (event) => {
  try {
    const { followerId, followedId, followerUserName } = event.data;

    await notificationService.createNotification({
      userId: followedId,
      type: 'user_followed',
      title: 'Nuevo seguidor',
      message: `${followerUserName} comenzó a seguirte`,
      data: {
        followerId,
        followerUserName,
        eventId: event.eventId,
      },
      actionUrl: `/profile/${followerId}`,
    });

    console.log(`[UserFollowNotificationHandler] Processed follow: ${followerUserName} -> ${followedId}`);
  } catch (error) {
    console.error('[UserFollowNotificationHandler] Error:', error);
  }
};

/**
 * Handler for welcome notifications
 * Sends welcome message to new users
 */
export const UserWelcomeNotificationHandler: EventHandler<UserRegisteredEvent> = async (event) => {
  try {
    const { userId, firstName } = event.data;

    await notificationService.createNotification({
      userId,
      type: 'welcome',
      title: `¡Bienvenido/a, ${firstName}!`,
      message: 'Te damos la bienvenida a FCiencias. ¡Explora y conecta con la comunidad!',
      data: {
        eventId: event.eventId,
        registrationDate: new Date().toISOString(),
      },
      actionUrl: '/dashboard/explore',
    });

    console.log(`[UserWelcomeNotificationHandler] Processed welcome for user: ${userId}`);
  } catch (error) {
    console.error('[UserWelcomeNotificationHandler] Error:', error);
  }
};

/**
 * Handler for post deletion cleanup
 * Removes notifications related to deleted posts
 */
export const PostDeletedCleanupHandler: EventHandler<PostDeletedEvent> = async (event) => {
  try {
    const { postId } = event.data;
    
    // In a real app, you would remove notifications related to this post
    // For demo, we'll just log the cleanup
    console.log(`[PostDeletedCleanupHandler] Would cleanup notifications for post: ${postId}`);
    
    // Example cleanup logic:
    // await notificationService.deleteNotificationsByPostId(postId);
  } catch (error) {
    console.error('[PostDeletedCleanupHandler] Error:', error);
  }
};

/**
 * Export notification service for testing and debugging
 */
export { notificationService };

/**
 * Utility to register all notification handlers
 */
export function registerNotificationHandlers(eventBus: any) {
  eventBus.subscribe('PostCreated', PostCreatedNotificationHandler);
  eventBus.subscribe('PostReactionAdded', PostReactionNotificationHandler);
  eventBus.subscribe('PostReactionMilestone', PostMilestoneNotificationHandler);
  eventBus.subscribe('UserFollowed', UserFollowNotificationHandler);
  eventBus.subscribe('UserRegistered', UserWelcomeNotificationHandler);
  eventBus.subscribe('PostDeleted', PostDeletedCleanupHandler);
  
  console.log('[NotificationHandlers] All notification handlers registered');
}
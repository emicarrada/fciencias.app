import { DomainEvent, EventMetadata } from './DomainEvent';
import type { Post } from '../../../domain/entities/Post';

/**
 * Event fired when a new post is created
 */
export class PostCreatedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    content: string;
    tags: string[];
    imageUrl?: string;
  };

  constructor(
    post: Post,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId: post.id,
      authorId: post.author.id,
      content: post.content,
      tags: post.tags,
      imageUrl: post.imageUrl,
    };

    super('PostCreated', eventData, {
      ...metadata,
      userId: metadata?.userId ?? post.author.id,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostCreatedEvent: postId is required and must be a string');
    }

    if (!data.authorId || typeof data.authorId !== 'string') {
      throw new Error('PostCreatedEvent: authorId is required and must be a string');
    }

    if (!data.content || typeof data.content !== 'string') {
      throw new Error('PostCreatedEvent: content is required and must be a string');
    }

    if (!Array.isArray(data.tags)) {
      throw new Error('PostCreatedEvent: tags must be an array');
    }
  }
}

/**
 * Event fired when a post is updated
 */
export class PostUpdatedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    previousContent: string;
    newContent: string;
    previousTags: string[];
    newTags: string[];
    changedFields: string[];
  };

  constructor(
    previousPost: Post,
    updatedPost: Post,
    metadata?: Partial<EventMetadata>
  ) {
    const changedFields = PostUpdatedEvent.getChangedFields(previousPost, updatedPost);
    
    const eventData = {
      postId: updatedPost.id,
      authorId: updatedPost.author.id,
      previousContent: previousPost.content,
      newContent: updatedPost.content,
      previousTags: previousPost.tags,
      newTags: updatedPost.tags,
      changedFields,
    };

    super('PostUpdated', eventData, {
      ...metadata,
      userId: metadata?.userId ?? updatedPost.author.id,
    });

    this.data = eventData;
  }

  private static getChangedFields(previous: Post, updated: Post): string[] {
    const changes: string[] = [];
    
    if (previous.content !== updated.content) {
      changes.push('content');
    }
    
    if (JSON.stringify(previous.tags) !== JSON.stringify(updated.tags)) {
      changes.push('tags');
    }
    
    if (previous.imageUrl !== updated.imageUrl) {
      changes.push('imageUrl');
    }

    return changes;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostUpdatedEvent: postId is required and must be a string');
    }

    if (!data.authorId || typeof data.authorId !== 'string') {
      throw new Error('PostUpdatedEvent: authorId is required and must be a string');
    }

    if (!Array.isArray(data.changedFields)) {
      throw new Error('PostUpdatedEvent: changedFields must be an array');
    }
  }
}

/**
 * Event fired when a post is deleted
 */
export class PostDeletedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    content: string;
    tags: string[];
    deletedBy: string;
    reason?: string;
  };

  constructor(
    post: Post,
    deletedBy: string,
    reason?: string,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId: post.id,
      authorId: post.author.id,
      content: post.content,
      tags: post.tags,
      deletedBy,
      reason,
    };

    super('PostDeleted', eventData, {
      ...metadata,
      userId: metadata?.userId ?? deletedBy,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostDeletedEvent: postId is required and must be a string');
    }

    if (!data.deletedBy || typeof data.deletedBy !== 'string') {
      throw new Error('PostDeletedEvent: deletedBy is required and must be a string');
    }
  }
}

/**
 * Event fired when a post is viewed by a user
 */
export class PostViewedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    viewerId: string;
    authorId: string;
    viewDuration?: number;
    source: 'feed' | 'profile' | 'search' | 'direct' | 'notification';
  };

  constructor(
    postId: string,
    viewerId: string,
    authorId: string,
    source: 'feed' | 'profile' | 'search' | 'direct' | 'notification',
    viewDuration?: number,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      viewerId,
      authorId,
      viewDuration,
      source,
    };

    super('PostViewed', eventData, {
      ...metadata,
      userId: metadata?.userId ?? viewerId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostViewedEvent: postId is required and must be a string');
    }

    if (!data.viewerId || typeof data.viewerId !== 'string') {
      throw new Error('PostViewedEvent: viewerId is required and must be a string');
    }

    const validSources = ['feed', 'profile', 'search', 'direct', 'notification'];
    if (!validSources.includes(data.source)) {
      throw new Error(`PostViewedEvent: source must be one of ${validSources.join(', ')}`);
    }
  }
}

/**
 * Event fired when a post is shared
 */
export class PostSharedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    sharedBy: string;
    authorId: string;
    shareMethod: 'link' | 'social' | 'email' | 'internal';
    platform?: string;
  };

  constructor(
    postId: string,
    sharedBy: string,
    authorId: string,
    shareMethod: 'link' | 'social' | 'email' | 'internal',
    platform?: string,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      sharedBy,
      authorId,
      shareMethod,
      platform,
    };

    super('PostShared', eventData, {
      ...metadata,
      userId: metadata?.userId ?? sharedBy,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostSharedEvent: postId is required and must be a string');
    }

    if (!data.sharedBy || typeof data.sharedBy !== 'string') {
      throw new Error('PostSharedEvent: sharedBy is required and must be a string');
    }

    const validMethods = ['link', 'social', 'email', 'internal'];
    if (!validMethods.includes(data.shareMethod)) {
      throw new Error(`PostSharedEvent: shareMethod must be one of ${validMethods.join(', ')}`);
    }
  }
}
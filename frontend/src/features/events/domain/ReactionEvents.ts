import { DomainEvent, EventMetadata } from './DomainEvent';
import type { Reaction, ReactionType } from '../../../domain/value-objects/Reaction';

/**
 * Event fired when a user adds a reaction to a post
 */
export class PostReactionAddedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    userId: string;
    reactionType: ReactionType;
    reactionWeight: number;
  };

  constructor(
    postId: string,
    authorId: string,
    userId: string,
    reaction: Reaction,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      authorId,
      userId,
      reactionType: reaction.type,
      reactionWeight: reaction.getWeight(),
    };

    super('PostReactionAdded', eventData, {
      ...metadata,
      userId: metadata?.userId ?? userId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostReactionAddedEvent: postId is required and must be a string');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('PostReactionAddedEvent: userId is required and must be a string');
    }

    const validReactionTypes = ['like', 'love', 'laugh', 'surprised', 'dislike'] as const;
    if (!validReactionTypes.includes(data.reactionType)) {
      throw new Error(`PostReactionAddedEvent: reactionType must be one of ${validReactionTypes.join(', ')}`);
    }
  }
}

/**
 * Event fired when a user changes their reaction to a post
 */
export class PostReactionChangedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    userId: string;
    previousReactionType: ReactionType;
    newReactionType: ReactionType;
    previousWeight: number;
    newWeight: number;
  };

  constructor(
    postId: string,
    authorId: string,
    userId: string,
    previousReaction: Reaction,
    newReaction: Reaction,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      authorId,
      userId,
      previousReactionType: previousReaction.type,
      newReactionType: newReaction.type,
      previousWeight: previousReaction.getWeight(),
      newWeight: newReaction.getWeight(),
    };

    super('PostReactionChanged', eventData, {
      ...metadata,
      userId: metadata?.userId ?? userId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostReactionChangedEvent: postId is required and must be a string');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('PostReactionChangedEvent: userId is required and must be a string');
    }

    const validReactionTypes = ['like', 'love', 'laugh', 'surprised', 'dislike'] as const;
    if (!validReactionTypes.includes(data.previousReactionType) || 
        !validReactionTypes.includes(data.newReactionType)) {
      throw new Error(`PostReactionChangedEvent: reaction types must be one of ${validReactionTypes.join(', ')}`);
    }
  }
}

/**
 * Event fired when a user removes their reaction from a post
 */
export class PostReactionRemovedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    userId: string;
    reactionType: ReactionType;
    reactionWeight: number;
  };

  constructor(
    postId: string,
    authorId: string,
    userId: string,
    removedReaction: Reaction,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      authorId,
      userId,
      reactionType: removedReaction.type,
      reactionWeight: removedReaction.getWeight(),
    };

    super('PostReactionRemoved', eventData, {
      ...metadata,
      userId: metadata?.userId ?? userId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostReactionRemovedEvent: postId is required and must be a string');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      throw new Error('PostReactionRemovedEvent: userId is required and must be a string');
    }

    const validReactionTypes = ['like', 'love', 'laugh', 'surprised', 'dislike'] as const;
    if (!validReactionTypes.includes(data.reactionType)) {
      throw new Error(`PostReactionRemovedEvent: reactionType must be one of ${validReactionTypes.join(', ')}`);
    }
  }
}

/**
 * Event fired when reaction summaries are updated for a post
 */
export class PostReactionSummaryUpdatedEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    totalReactions: number;
    engagementScore: number;
    reactionCounts: Record<ReactionType, number>;
    topReactionType?: ReactionType;
    previousTotalReactions?: number;
  };

  constructor(
    postId: string,
    authorId: string,
    totalReactions: number,
    engagementScore: number,
    reactionCounts: Record<ReactionType, number>,
    topReactionType?: ReactionType,
    previousTotalReactions?: number,
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      authorId,
      totalReactions,
      engagementScore,
      reactionCounts,
      topReactionType,
      previousTotalReactions,
    };

    super('PostReactionSummaryUpdated', eventData, {
      ...metadata,
      userId: metadata?.userId ?? authorId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostReactionSummaryUpdatedEvent: postId is required and must be a string');
    }

    if (typeof data.totalReactions !== 'number' || data.totalReactions < 0) {
      throw new Error('PostReactionSummaryUpdatedEvent: totalReactions must be a non-negative number');
    }

    if (typeof data.engagementScore !== 'number') {
      throw new Error('PostReactionSummaryUpdatedEvent: engagementScore must be a number');
    }

    if (!data.reactionCounts || typeof data.reactionCounts !== 'object') {
      throw new Error('PostReactionSummaryUpdatedEvent: reactionCounts must be an object');
    }
  }
}

/**
 * Event fired when a post reaches a reaction milestone
 */
export class PostReactionMilestoneEvent extends DomainEvent {
  public readonly data: {
    postId: string;
    authorId: string;
    milestone: number;
    totalReactions: number;
    milestoneType: 'first_reaction' | 'ten_reactions' | 'hundred_reactions' | 'thousand_reactions' | 'viral';
    achievedAt: Date;
  };

  constructor(
    postId: string,
    authorId: string,
    milestone: number,
    totalReactions: number,
    milestoneType: 'first_reaction' | 'ten_reactions' | 'hundred_reactions' | 'thousand_reactions' | 'viral',
    metadata?: Partial<EventMetadata>
  ) {
    const eventData = {
      postId,
      authorId,
      milestone,
      totalReactions,
      milestoneType,
      achievedAt: new Date(),
    };

    super('PostReactionMilestone', eventData, {
      ...metadata,
      userId: metadata?.userId ?? authorId,
    });

    this.data = eventData;
  }

  protected validateEventData(data: Record<string, any>): void {
    super.validateEventData(data);

    if (!data.postId || typeof data.postId !== 'string') {
      throw new Error('PostReactionMilestoneEvent: postId is required and must be a string');
    }

    if (typeof data.milestone !== 'number' || data.milestone <= 0) {
      throw new Error('PostReactionMilestoneEvent: milestone must be a positive number');
    }

    const validMilestoneTypes = ['first_reaction', 'ten_reactions', 'hundred_reactions', 'thousand_reactions', 'viral'];
    if (!validMilestoneTypes.includes(data.milestoneType)) {
      throw new Error(`PostReactionMilestoneEvent: milestoneType must be one of ${validMilestoneTypes.join(', ')}`);
    }
  }
}
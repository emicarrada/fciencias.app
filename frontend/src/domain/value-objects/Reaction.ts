/**
 * Reaction types available in the system
 */
export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  SURPRISED = 'surprised',
  DISLIKE = 'dislike'
}

/**
 * Reaction value object with business logic
 */
export class Reaction {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly type: ReactionType,
    public readonly createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Reaction ID is required');
    }

    if (!this.postId || this.postId.trim().length === 0) {
      throw new Error('Post ID is required');
    }

    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    if (!Object.values(ReactionType).includes(this.type)) {
      throw new Error('Invalid reaction type');
    }

    if (!this.createdAt) {
      throw new Error('Reaction creation date is required');
    }

    if (this.createdAt > new Date()) {
      throw new Error('Reaction creation date cannot be in the future');
    }
  }

  /**
   * Get reaction emoji
   */
  getEmoji(): string {
    switch (this.type) {
      case ReactionType.LIKE:
        return '👍';
      case ReactionType.LOVE:
        return '❤️';
      case ReactionType.LAUGH:
        return '😂';
      case ReactionType.SURPRISED:
        return '😮';
      case ReactionType.DISLIKE:
        return '👎';
      default:
        return '👍';
    }
  }

  /**
   * Get reaction label
   */
  getLabel(): string {
    switch (this.type) {
      case ReactionType.LIKE:
        return 'Me gusta';
      case ReactionType.LOVE:
        return 'Me encanta';
      case ReactionType.LAUGH:
        return 'Me divierte';
      case ReactionType.SURPRISED:
        return 'Me sorprende';
      case ReactionType.DISLIKE:
        return 'No me gusta';
      default:
        return 'Me gusta';
    }
  }

  /**
   * Check if reaction is positive
   */
  isPositive(): boolean {
    return [ReactionType.LIKE, ReactionType.LOVE, ReactionType.LAUGH, ReactionType.SURPRISED].includes(this.type);
  }

  /**
   * Check if reaction is negative
   */
  isNegative(): boolean {
    return this.type === ReactionType.DISLIKE;
  }

  /**
   * Get reaction weight for scoring
   */
  getWeight(): number {
    switch (this.type) {
      case ReactionType.LIKE:
        return 1;
      case ReactionType.LOVE:
        return 2;
      case ReactionType.LAUGH:
        return 1.5;
      case ReactionType.SURPRISED:
        return 1;
      case ReactionType.DISLIKE:
        return -1;
      default:
        return 1;
    }
  }

  /**
   * Create reaction from API data
   */
  static fromApiData(data: any): Reaction {
    return new Reaction(
      data.id,
      data.postId,
      data.userId,
      data.type as ReactionType,
      new Date(data.createdAt)
    );
  }

  /**
   * Convert to API format
   */
  toApiData(): any {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      type: this.type,
      createdAt: this.createdAt.toISOString()
    };
  }

  /**
   * Check if two reactions are equal
   */
  equals(other: Reaction): boolean {
    return this.id === other.id;
  }
}

/**
 * Reaction summary for a post
 */
export class ReactionSummary {
  constructor(
    public readonly postId: string,
    public readonly reactions: Map<ReactionType, number> = new Map(),
    public readonly totalCount: number = 0,
    public readonly userReaction?: ReactionType
  ) {}

  /**
   * Get count for specific reaction type
   */
  getCount(type: ReactionType): number {
    return this.reactions.get(type) || 0;
  }

  /**
   * Check if user has reacted
   */
  hasUserReacted(): boolean {
    return !!this.userReaction;
  }

  /**
   * Get user reaction emoji if exists
   */
  getUserReactionEmoji(): string | null {
    if (!this.userReaction) return null;
    const reaction = new Reaction('', '', '', this.userReaction, new Date());
    return reaction.getEmoji();
  }

  /**
   * Get most popular reaction type
   */
  getMostPopular(): ReactionType | null {
    if (this.reactions.size === 0) return null;
    
    let maxCount = 0;
    let mostPopular: ReactionType | null = null;
    
    this.reactions.forEach((count, type) => {
      if (count > maxCount) {
        maxCount = count;
        mostPopular = type;
      }
    });
    
    return mostPopular;
  }

  /**
   * Get reactions sorted by count (descending)
   */
  getSortedReactions(): Array<{ type: ReactionType; count: number; emoji: string }> {
    return Array.from(this.reactions.entries())
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)
      .map(([type, count]) => ({
        type,
        count,
        emoji: new Reaction('', '', '', type, new Date()).getEmoji()
      }));
  }

  /**
   * Calculate engagement score
   */
  getEngagementScore(): number {
    let score = 0;
    this.reactions.forEach((count, type) => {
      const reaction = new Reaction('', '', '', type, new Date());
      score += count * reaction.getWeight();
    });
    return score;
  }
}
import { User } from '@/types/auth';

/**
 * Post entity with business logic and validations
 */
export class Post {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly author: User,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly imageUrl?: string,
    public readonly tags: string[] = []
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Post ID is required');
    }

    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Post content is required');
    }

    if (this.content.length > 1000) {
      throw new Error('Post content cannot exceed 1000 characters');
    }

    if (!this.author) {
      throw new Error('Post author is required');
    }

    if (!this.createdAt) {
      throw new Error('Post creation date is required');
    }

    if (!this.updatedAt) {
      throw new Error('Post update date is required');
    }

    if (this.updatedAt < this.createdAt) {
      throw new Error('Post update date cannot be before creation date');
    }

    // Validate tags
    if (this.tags.some(tag => tag.trim().length === 0)) {
      throw new Error('Post tags cannot be empty');
    }

    if (this.tags.length > 10) {
      throw new Error('Post cannot have more than 10 tags');
    }
  }

  /**
   * Get formatted creation date
   */
  getFormattedDate(): string {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(this.createdAt);
  }

  /**
   * Get time ago string
   */
  getTimeAgo(): string {
    const now = new Date();
    const diffInMs = now.getTime() - this.createdAt.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'hace un momento';
    } else if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInDays < 7) {
      return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    } else {
      return this.getFormattedDate();
    }
  }

  /**
   * Check if post has image
   */
  hasImage(): boolean {
    return !!this.imageUrl && this.imageUrl.trim().length > 0;
  }

  /**
   * Check if post has tags
   */
  hasTags(): boolean {
    return this.tags.length > 0;
  }

  /**
   * Get content preview (first 100 characters)
   */
  getContentPreview(): string {
    if (this.content.length <= 100) {
      return this.content;
    }
    return this.content.substring(0, 100) + '...';
  }

  /**
   * Check if content is long (needs "read more")
   */
  isLongContent(): boolean {
    return this.content.length > 200;
  }

  /**
   * Create a new Post from API data
   */
  static fromApiData(data: any): Post {
    return new Post(
      data.id,
      data.content,
      data.author,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.imageUrl,
      data.tags || []
    );
  }

  /**
   * Convert to API format
   */
  toApiData(): any {
    return {
      id: this.id,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      imageUrl: this.imageUrl,
      tags: this.tags
    };
  }
}
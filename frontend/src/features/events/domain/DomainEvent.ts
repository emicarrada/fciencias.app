/**
 * Base interface for all domain events
 * Provides common properties for event identification and tracking
 */
export interface IDomainEvent {
  /** Unique identifier for this event instance */
  readonly eventId: string;
  
  /** Type/name of the event (e.g., 'PostCreated', 'UserRegistered') */
  readonly eventType: string;
  
  /** When this event occurred */
  readonly occurredAt: Date;
  
  /** ID of the user who triggered this event (if applicable) */
  readonly userId?: string;
  
  /** Correlation ID for tracking related events */
  readonly correlationId?: string;
  
  /** Event-specific data payload */
  readonly data: Record<string, any>;
  
  /** Version of the event schema (for future migrations) */
  readonly version: number;
}

/**
 * Metadata for domain events
 * Provides additional context and tracking information
 */
export interface EventMetadata {
  /** Unique identifier for this event instance */
  eventId: string;
  
  /** When this event occurred */
  occurredAt: Date;
  
  /** ID of the user who triggered this event */
  userId?: string;
  
  /** Correlation ID for tracking related events */
  correlationId?: string;
  
  /** Event version for schema evolution */
  version: number;
  
  /** Source that generated this event */
  source?: string;
  
  /** Additional tags for categorization */
  tags?: string[];
}

/**
 * Abstract base class for all domain events
 * Provides common functionality and ensures consistency
 */
export abstract class DomainEvent implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly occurredAt: Date;
  public readonly userId?: string;
  public readonly correlationId?: string;
  public readonly version: number;
  
  constructor(
    eventType: string,
    data: Record<string, any>,
    metadata?: Partial<EventMetadata>
  ) {
    this.eventId = metadata?.eventId ?? this.generateEventId();
    this.eventType = eventType;
    this.occurredAt = metadata?.occurredAt ?? new Date();
    this.userId = metadata?.userId;
    this.correlationId = metadata?.correlationId;
    this.version = metadata?.version ?? 1;
    
    // Validate event data
    this.validateEventData(data);
  }
  
  /** Abstract property for event-specific data */
  public abstract readonly data: Record<string, any>;
  
  /**
   * Generate a unique event ID
   * Uses timestamp + random for uniqueness
   */
  private generateEventId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `evt_${timestamp}_${random}`;
  }
  
  /**
   * Validate event data - can be overridden by specific events
   * @param data Event-specific data to validate
   */
  protected validateEventData(data: Record<string, any>): void {
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid event data for ${this.eventType}: data must be an object`);
    }
  }
  
  /**
   * Serialize event to JSON
   * Useful for persistence or transmission
   */
  public toJSON(): string {
    return JSON.stringify({
      eventId: this.eventId,
      eventType: this.eventType,
      occurredAt: this.occurredAt.toISOString(),
      userId: this.userId,
      correlationId: this.correlationId,
      version: this.version,
      data: this.data
    });
  }
  
  /**
   * Create event from JSON
   * Static method for deserialization
   */
  public static fromJSON(json: string): IDomainEvent {
    const parsed = JSON.parse(json);
    
    return {
      eventId: parsed.eventId,
      eventType: parsed.eventType,
      occurredAt: new Date(parsed.occurredAt),
      userId: parsed.userId,
      correlationId: parsed.correlationId,
      version: parsed.version,
      data: parsed.data
    };
  }
}

/**
 * Utility functions for working with events
 */
export class EventUtils {
  /**
   * Generate a correlation ID for tracking related events
   */
  static generateCorrelationId(): string {
    return `corr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
  }
  
  /**
   * Check if an event matches a specific type
   */
  static isEventOfType<T extends IDomainEvent>(
    event: IDomainEvent,
    eventType: string
  ): event is T {
    return event.eventType === eventType;
  }
  
  /**
   * Filter events by type
   */
  static filterEventsByType<T extends IDomainEvent>(
    events: IDomainEvent[],
    eventType: string
  ): T[] {
    return events.filter(event => 
      EventUtils.isEventOfType<T>(event, eventType)
    ) as T[];
  }
  
  /**
   * Group events by correlation ID
   */
  static groupEventsByCorrelation(
    events: IDomainEvent[]
  ): Map<string, IDomainEvent[]> {
    const groups = new Map<string, IDomainEvent[]>();
    
    for (const event of events) {
      if (event.correlationId) {
        const existing = groups.get(event.correlationId) || [];
        existing.push(event);
        groups.set(event.correlationId, existing);
      }
    }
    
    return groups;
  }
  
  /**
   * Sort events by occurrence time
   */
  static sortEventsByTime(events: IDomainEvent[]): IDomainEvent[] {
    return [...events].sort((a, b) => 
      a.occurredAt.getTime() - b.occurredAt.getTime()
    );
  }
}
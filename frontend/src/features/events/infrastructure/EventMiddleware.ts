import type { IDomainEvent } from '../domain/DomainEvent';
import type { 
  IEventMiddleware, 
  EventPublicationResult,
  IEventBus,
  EventBusConfig
} from './EventBusInterfaces';
import { InMemoryEventBus } from './InMemoryEventBus';

/**
 * Logging middleware for events
 * Logs all events that pass through the event bus
 */
export class LoggingMiddleware implements IEventMiddleware {
  public readonly name = 'LoggingMiddleware';
  public readonly priority = 10;

  constructor(
    private readonly logger: (message: string, level: 'info' | 'warn' | 'error') => void = console.log
  ) {}

  async process(
    event: IDomainEvent,
    next: (event: IDomainEvent) => Promise<EventPublicationResult>
  ): Promise<EventPublicationResult> {
    const startTime = Date.now();
    
    this.logger(
      `[${this.name}] Processing event: ${event.eventType} (ID: ${event.eventId})`,
      'info'
    );

    try {
      const result = await next(event);
      const executionTime = Date.now() - startTime;
      
      this.logger(
        `[${this.name}] Event processed successfully: ${event.eventType} ` +
        `(${result.handlersExecuted} handlers, ${executionTime}ms)`,
        'info'
      );
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.logger(
        `[${this.name}] Event processing failed: ${event.eventType} ` +
        `(${executionTime}ms) - ${errorMessage}`,
        'error'
      );
      
      throw error;
    }
  }
}

/**
 * Validation middleware for events
 * Validates events before they are processed
 */
export class ValidationMiddleware implements IEventMiddleware {
  public readonly name = 'ValidationMiddleware';
  public readonly priority = 5; // Higher priority (runs before logging)

  async process(
    event: IDomainEvent,
    next: (event: IDomainEvent) => Promise<EventPublicationResult>
  ): Promise<EventPublicationResult> {
    // Basic validation
    if (!event.eventId || event.eventId.trim().length === 0) {
      throw new Error('Event must have a valid eventId');
    }

    if (!event.eventType || event.eventType.trim().length === 0) {
      throw new Error('Event must have a valid eventType');
    }

    if (!event.occurredAt || isNaN(event.occurredAt.getTime())) {
      throw new Error('Event must have a valid occurredAt timestamp');
    }

    if (!event.data || typeof event.data !== 'object') {
      throw new Error('Event must have valid data object');
    }

    // Check if event is too old (more than 24 hours)
    const eventAge = Date.now() - event.occurredAt.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (eventAge > maxAge) {
      throw new Error(`Event is too old: ${event.eventType} (age: ${Math.round(eventAge / 1000 / 60)} minutes)`);
    }

    return next(event);
  }
}

/**
 * Retry middleware for failed events
 * Automatically retries failed events with exponential backoff
 */
export class RetryMiddleware implements IEventMiddleware {
  public readonly name = 'RetryMiddleware';
  public readonly priority = 20; // Lower priority (runs after logging)

  constructor(
    private readonly maxRetries: number = 3,
    private readonly baseDelay: number = 1000,
    private readonly maxDelay: number = 10000
  ) {}

  async process(
    event: IDomainEvent,
    next: (event: IDomainEvent) => Promise<EventPublicationResult>
  ): Promise<EventPublicationResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await next(event);
        
        // If there were failures but not total failure, don't retry
        if (result.success || result.handlersExecuted > 0) {
          return result;
        }
        
        // If no handlers executed and there are errors, retry
        if (result.errors.length > 0) {
          lastError = result.errors[0];
        }
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
      
      // Don't wait after the last attempt
      if (attempt < this.maxRetries) {
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt),
          this.maxDelay
        );
        
        await this.sleep(delay);
      }
    }
    
    throw lastError || new Error(`Failed to process event after ${this.maxRetries + 1} attempts`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Analytics middleware for tracking event metrics
 * Collects detailed analytics about event processing
 */
export class AnalyticsMiddleware implements IEventMiddleware {
  public readonly name = 'AnalyticsMiddleware';
  public readonly priority = 30;

  private analytics: Map<string, {
    totalEvents: number;
    totalExecutionTime: number;
    successfulEvents: number;
    failedEvents: number;
    averageHandlers: number;
    lastSeen: Date;
  }> = new Map();

  async process(
    event: IDomainEvent,
    next: (event: IDomainEvent) => Promise<EventPublicationResult>
  ): Promise<EventPublicationResult> {
    const startTime = Date.now();
    
    try {
      const result = await next(event);
      
      this.recordAnalytics(event, result, Date.now() - startTime, true);
      
      return result;
    } catch (error) {
      this.recordAnalytics(event, null, Date.now() - startTime, false);
      throw error;
    }
  }

  private recordAnalytics(
    event: IDomainEvent,
    result: EventPublicationResult | null,
    executionTime: number,
    success: boolean
  ): void {
    const eventType = event.eventType;
    const existing = this.analytics.get(eventType) || {
      totalEvents: 0,
      totalExecutionTime: 0,
      successfulEvents: 0,
      failedEvents: 0,
      averageHandlers: 0,
      lastSeen: new Date()
    };

    existing.totalEvents++;
    existing.totalExecutionTime += executionTime;
    existing.lastSeen = new Date();

    if (success) {
      existing.successfulEvents++;
      if (result) {
        // Update average handlers
        existing.averageHandlers = 
          (existing.averageHandlers * (existing.successfulEvents - 1) + result.handlersExecuted) / 
          existing.successfulEvents;
      }
    } else {
      existing.failedEvents++;
    }

    this.analytics.set(eventType, existing);
  }

  getAnalytics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [eventType, data] of this.analytics.entries()) {
      result[eventType] = {
        ...data,
        averageExecutionTime: data.totalEvents > 0 ? data.totalExecutionTime / data.totalEvents : 0,
        successRate: data.totalEvents > 0 ? (data.successfulEvents / data.totalEvents) * 100 : 0
      };
    }
    
    return result;
  }

  clearAnalytics(): void {
    this.analytics.clear();
  }
}

/**
 * Event bus with middleware support
 * Extends the basic InMemoryEventBus with middleware capabilities
 */
export class MiddlewareEventBus extends InMemoryEventBus {
  private middlewares: IEventMiddleware[] = [];

  constructor(config: EventBusConfig = {}) {
    super(config);
  }

  /**
   * Add middleware to the event bus
   * Middleware is executed in priority order (lower numbers first)
   */
  addMiddleware(middleware: IEventMiddleware): void {
    this.middlewares.push(middleware);
    this.middlewares.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Remove middleware from the event bus
   */
  removeMiddleware(middlewareName: string): void {
    this.middlewares = this.middlewares.filter(m => m.name !== middlewareName);
  }

  /**
   * Get all registered middleware
   */
  getMiddlewares(): IEventMiddleware[] {
    return [...this.middlewares];
  }

  /**
   * Clear all middleware
   */
  clearMiddlewares(): void {
    this.middlewares = [];
  }

  /**
   * Override publish to use middleware chain
   */
  async publish<T extends IDomainEvent>(event: T): Promise<EventPublicationResult> {
    if (this.middlewares.length === 0) {
      return super.publish(event);
    }

    return this.executeMiddlewareChain(event, 0);
  }

  private async executeMiddlewareChain(
    event: IDomainEvent,
    middlewareIndex: number
  ): Promise<EventPublicationResult> {
    if (middlewareIndex >= this.middlewares.length) {
      // All middleware executed, call the actual publish method
      return super.publish(event);
    }

    const middleware = this.middlewares[middlewareIndex];
    
    return middleware.process(event, (processedEvent) => 
      this.executeMiddlewareChain(processedEvent, middlewareIndex + 1)
    );
  }
}
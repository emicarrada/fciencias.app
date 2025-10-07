import type { IDomainEvent } from '../domain/DomainEvent';
import type {
  IEventBus,
  EventHandler,
  EventSubscription,
  EventPublicationResult,
  EventBusConfig,
  EventBusStats,
  IEventHandlerRegistry,
  IEventQueue
} from './EventBusInterfaces';

/**
 * Simple subscription implementation
 */
class Subscription implements EventSubscription {
  private _isActive = true;

  constructor(
    public readonly id: string,
    public readonly eventType: string,
    public readonly handler: EventHandler,
    private readonly unsubscribeCallback: () => void
  ) {}

  unsubscribe(): void {
    if (this._isActive) {
      this._isActive = false;
      this.unsubscribeCallback();
    }
  }

  get isActive(): boolean {
    return this._isActive;
  }
}

/**
 * Event handler registry implementation
 */
class EventHandlerRegistry implements IEventHandlerRegistry {
  private handlers = new Map<string, Map<string, EventHandler>>();
  private subscriptions = new Map<string, Subscription>();

  register<T extends IDomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    const subscriptionId = this.generateSubscriptionId();
    
    // Get or create handlers map for this event type
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map());
    }
    
    const eventHandlers = this.handlers.get(eventType)!;
    eventHandlers.set(subscriptionId, handler as EventHandler);
    
    // Create subscription
    const subscription = new Subscription(
      subscriptionId,
      eventType,
      handler as EventHandler,
      () => this.unregister(subscription)
    );
    
    this.subscriptions.set(subscriptionId, subscription);
    
    return subscription;
  }

  unregister(subscription: EventSubscription): void {
    const eventHandlers = this.handlers.get(subscription.eventType);
    if (eventHandlers) {
      eventHandlers.delete(subscription.id);
      
      // Clean up empty event type maps
      if (eventHandlers.size === 0) {
        this.handlers.delete(subscription.eventType);
      }
    }
    
    this.subscriptions.delete(subscription.id);
  }

  getHandlers(eventType: string): EventHandler[] {
    const eventHandlers = this.handlers.get(eventType);
    return eventHandlers ? Array.from(eventHandlers.values()) : [];
  }

  getEventTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
    this.subscriptions.clear();
  }

  getSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values());
  }

  getSubscriptionsFor(eventType: string): Subscription[] {
    return this.getSubscriptions().filter(sub => sub.eventType === eventType);
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

/**
 * Simple FIFO event queue implementation
 */
class EventQueue implements IEventQueue {
  private queue: IDomainEvent[] = [];

  enqueue(event: IDomainEvent): void {
    this.queue.push(event);
  }

  dequeue(): IDomainEvent | null {
    return this.queue.shift() ?? null;
  }

  peek(): IDomainEvent | null {
    return this.queue[0] ?? null;
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear(): void {
    this.queue.length = 0;
  }
}

/**
 * In-memory event bus implementation
 * Provides synchronous and asynchronous event handling
 */
export class InMemoryEventBus implements IEventBus {
  private readonly registry: EventHandlerRegistry;
  private readonly config: Required<EventBusConfig>;
  private readonly stats: EventBusStats;

  constructor(config: EventBusConfig = {}) {
    this.registry = new EventHandlerRegistry();
    this.config = {
      maxHandlersPerEvent: config.maxHandlersPerEvent ?? 50,
      executeInParallel: config.executeInParallel ?? true,
      handlerTimeout: config.handlerTimeout ?? 5000,
      catchHandlerErrors: config.catchHandlerErrors ?? true,
      enableLogging: config.enableLogging ?? false,
      logger: config.logger ?? this.defaultLogger,
    };
    
    this.stats = {
      totalEventsPublished: 0,
      totalHandlersExecuted: 0,
      totalHandlerFailures: 0,
      activeSubscriptions: 0,
      eventsByType: {},
      averageExecutionTime: {},
    };
  }

  async publish<T extends IDomainEvent>(event: T): Promise<EventPublicationResult> {
    const startTime = Date.now();
    
    try {
      this.log(`Publishing event: ${event.eventType}`, 'info');
      
      const handlers = this.registry.getHandlers(event.eventType);
      
      if (handlers.length === 0) {
        this.log(`No handlers found for event: ${event.eventType}`, 'warn');
        
        return {
          success: true,
          handlersExecuted: 0,
          handlersFailed: 0,
          errors: [],
          executionTime: Date.now() - startTime,
          event,
        };
      }

      // Execute handlers
      const results = await this.executeHandlers(event, handlers);
      
      // Update statistics
      this.updateStats(event, results.handlersExecuted, results.handlersFailed, Date.now() - startTime);
      
      this.log(
        `Event published: ${event.eventType}, ` +
        `executed: ${results.handlersExecuted}, ` +
        `failed: ${results.handlersFailed}`,
        results.handlersFailed > 0 ? 'warn' : 'info'
      );

      return {
        ...results,
        executionTime: Date.now() - startTime,
        event,
      };
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      this.log(`Error publishing event ${event.eventType}: ${errorObj.message}`, 'error');
      
      return {
        success: false,
        handlersExecuted: 0,
        handlersFailed: 0,
        errors: [errorObj],
        executionTime: Date.now() - startTime,
        event,
      };
    }
  }

  subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription {
    const currentHandlers = this.registry.getHandlers(eventType);
    
    if (currentHandlers.length >= this.config.maxHandlersPerEvent) {
      throw new Error(
        `Maximum number of handlers (${this.config.maxHandlersPerEvent}) ` +
        `reached for event type: ${eventType}`
      );
    }

    const subscription = this.registry.register(eventType, handler);
    this.stats.activeSubscriptions++;
    
    this.log(`Subscribed to event: ${eventType}`, 'info');
    
    return subscription;
  }

  subscribeToMultiple<T extends IDomainEvent>(
    eventTypes: string[],
    handler: EventHandler<T>
  ): EventSubscription[] {
    return eventTypes.map(eventType => this.subscribe(eventType, handler));
  }

  unsubscribe(subscription: EventSubscription): void {
    this.registry.unregister(subscription);
    this.stats.activeSubscriptions--;
    
    this.log(`Unsubscribed from event: ${subscription.eventType}`, 'info');
  }

  unsubscribeAll(eventType: string): void {
    const subscriptions = this.registry.getSubscriptionsFor(eventType);
    
    subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      this.stats.activeSubscriptions--;
    });
    
    this.log(`Unsubscribed all handlers for event: ${eventType}`, 'info');
  }

  clear(): void {
    const subscriptionCount = this.registry.getSubscriptions().length;
    this.registry.clear();
    this.stats.activeSubscriptions = 0;
    
    this.log(`Cleared all subscriptions (${subscriptionCount} removed)`, 'info');
  }

  getSubscriptions(): EventSubscription[] {
    return this.registry.getSubscriptions();
  }

  getSubscriptionsFor(eventType: string): EventSubscription[] {
    return this.registry.getSubscriptionsFor(eventType);
  }

  hasHandlers(eventType: string): boolean {
    return this.registry.getHandlers(eventType).length > 0;
  }

  getStats(): EventBusStats {
    return {
      ...this.stats,
      activeSubscriptions: this.registry.getSubscriptions().length,
    };
  }

  resetStats(): void {
    this.stats.totalEventsPublished = 0;
    this.stats.totalHandlersExecuted = 0;
    this.stats.totalHandlerFailures = 0;
    this.stats.eventsByType = {};
    this.stats.averageExecutionTime = {};
    delete this.stats.lastEventAt;
    
    this.log('Statistics reset', 'info');
  }

  private async executeHandlers(
    event: IDomainEvent,
    handlers: EventHandler[]
  ): Promise<Pick<EventPublicationResult, 'success' | 'handlersExecuted' | 'handlersFailed' | 'errors'>> {
    if (this.config.executeInParallel) {
      return this.executeHandlersInParallel(event, handlers);
    } else {
      return this.executeHandlersSequentially(event, handlers);
    }
  }

  private async executeHandlersInParallel(
    event: IDomainEvent,
    handlers: EventHandler[]
  ): Promise<Pick<EventPublicationResult, 'success' | 'handlersExecuted' | 'handlersFailed' | 'errors'>> {
    const promises = handlers.map(handler => this.executeHandlerSafely(event, handler));
    const results = await Promise.allSettled(promises);
    
    const errors: Error[] = [];
    let handlersFailed = 0;
    let handlersExecuted = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        handlersExecuted++;
      } else {
        handlersFailed++;
        errors.push(
          result.reason instanceof Error 
            ? result.reason 
            : new Error(String(result.reason))
        );
      }
    });

    return {
      success: handlersFailed === 0,
      handlersExecuted,
      handlersFailed,
      errors,
    };
  }

  private async executeHandlersSequentially(
    event: IDomainEvent,
    handlers: EventHandler[]
  ): Promise<Pick<EventPublicationResult, 'success' | 'handlersExecuted' | 'handlersFailed' | 'errors'>> {
    const errors: Error[] = [];
    let handlersFailed = 0;
    let handlersExecuted = 0;

    for (const handler of handlers) {
      try {
        await this.executeHandlerSafely(event, handler);
        handlersExecuted++;
      } catch (error) {
        handlersFailed++;
        errors.push(
          error instanceof Error ? error : new Error(String(error))
        );
        
        // Continue with next handler even if current one failed
        if (!this.config.catchHandlerErrors) {
          break;
        }
      }
    }

    return {
      success: handlersFailed === 0,
      handlersExecuted,
      handlersFailed,
      errors,
    };
  }

  private async executeHandlerSafely(
    event: IDomainEvent,
    handler: EventHandler
  ): Promise<void> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Handler timeout after ${this.config.handlerTimeout}ms`));
      }, this.config.handlerTimeout);
    });

    const handlerPromise = Promise.resolve(handler(event));

    return Promise.race([handlerPromise, timeoutPromise]);
  }

  private updateStats(
    event: IDomainEvent,
    handlersExecuted: number,
    handlersFailed: number,
    executionTime: number
  ): void {
    this.stats.totalEventsPublished++;
    this.stats.totalHandlersExecuted += handlersExecuted;
    this.stats.totalHandlerFailures += handlersFailed;
    this.stats.lastEventAt = new Date();

    // Update events by type
    const eventType = event.eventType;
    this.stats.eventsByType[eventType] = (this.stats.eventsByType[eventType] ?? 0) + 1;

    // Update average execution time
    const currentAvg = this.stats.averageExecutionTime[eventType] ?? 0;
    const currentCount = this.stats.eventsByType[eventType];
    this.stats.averageExecutionTime[eventType] = 
      (currentAvg * (currentCount - 1) + executionTime) / currentCount;
  }

  private log(message: string, level: 'info' | 'warn' | 'error'): void {
    if (this.config.enableLogging) {
      this.config.logger(`[EventBus] ${message}`, level);
    }
  }

  private defaultLogger(message: string, level: 'info' | 'warn' | 'error'): void {
    switch (level) {
      case 'info':
        console.log(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
    }
  }
}
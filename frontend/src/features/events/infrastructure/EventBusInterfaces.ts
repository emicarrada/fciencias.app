import type { IDomainEvent } from '../domain/DomainEvent';

/**
 * Type-safe event handler function
 * Receives an event and can return a promise for async handling
 */
export type EventHandler<T extends IDomainEvent = IDomainEvent> = (
  event: T
) => void | Promise<void>;

/**
 * Event subscription interface
 * Provides unsubscribe functionality
 */
export interface EventSubscription {
  /** Unique identifier for this subscription */
  readonly id: string;
  
  /** Event type this subscription listens to */
  readonly eventType: string;
  
  /** Handler function for this subscription */
  readonly handler: EventHandler;
  
  /** Unsubscribe from events */
  unsubscribe(): void;
  
  /** Whether this subscription is active */
  readonly isActive: boolean;
}

/**
 * Event publication result
 * Contains information about the publication process
 */
export interface EventPublicationResult {
  /** Whether the event was successfully published */
  success: boolean;
  
  /** Number of handlers that received the event */
  handlersExecuted: number;
  
  /** Number of handlers that failed */
  handlersFailed: number;
  
  /** Errors that occurred during handler execution */
  errors: Error[];
  
  /** Time taken to publish (in milliseconds) */
  executionTime: number;
  
  /** The published event */
  event: IDomainEvent;
}

/**
 * Event bus configuration options
 */
export interface EventBusConfig {
  /** Maximum number of handlers per event type */
  maxHandlersPerEvent?: number;
  
  /** Whether to execute handlers in parallel */
  executeInParallel?: boolean;
  
  /** Timeout for async handlers (in milliseconds) */
  handlerTimeout?: number;
  
  /** Whether to catch and collect handler errors */
  catchHandlerErrors?: boolean;
  
  /** Whether to log events and handler execution */
  enableLogging?: boolean;
  
  /** Custom logger function */
  logger?: (message: string, level: 'info' | 'warn' | 'error') => void;
}

/**
 * Event bus statistics
 */
export interface EventBusStats {
  /** Total events published */
  totalEventsPublished: number;
  
  /** Total handlers executed */
  totalHandlersExecuted: number;
  
  /** Total handler failures */
  totalHandlerFailures: number;
  
  /** Number of active subscriptions */
  activeSubscriptions: number;
  
  /** Events published by type */
  eventsByType: Record<string, number>;
  
  /** Average execution time per event type */
  averageExecutionTime: Record<string, number>;
  
  /** Last event published timestamp */
  lastEventAt?: Date;
}

/**
 * Main Event Bus interface
 * Provides publish/subscribe functionality for domain events
 */
export interface IEventBus {
  /**
   * Publish an event to all registered handlers
   * @param event The domain event to publish
   * @returns Promise with publication result
   */
  publish<T extends IDomainEvent>(event: T): Promise<EventPublicationResult>;
  
  /**
   * Subscribe to a specific event type
   * @param eventType The type of event to subscribe to
   * @param handler The handler function to execute
   * @returns Subscription object with unsubscribe capability
   */
  subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription;
  
  /**
   * Subscribe to multiple event types with the same handler
   * @param eventTypes Array of event types to subscribe to
   * @param handler The handler function to execute
   * @returns Array of subscription objects
   */
  subscribeToMultiple<T extends IDomainEvent>(
    eventTypes: string[],
    handler: EventHandler<T>
  ): EventSubscription[];
  
  /**
   * Unsubscribe a specific subscription
   * @param subscription The subscription to remove
   */
  unsubscribe(subscription: EventSubscription): void;
  
  /**
   * Unsubscribe all handlers for a specific event type
   * @param eventType The event type to unsubscribe from
   */
  unsubscribeAll(eventType: string): void;
  
  /**
   * Clear all subscriptions
   */
  clear(): void;
  
  /**
   * Get all active subscriptions
   * @returns Array of active subscriptions
   */
  getSubscriptions(): EventSubscription[];
  
  /**
   * Get subscriptions for a specific event type
   * @param eventType The event type to get subscriptions for
   * @returns Array of subscriptions for the event type
   */
  getSubscriptionsFor(eventType: string): EventSubscription[];
  
  /**
   * Check if there are any handlers for an event type
   * @param eventType The event type to check
   * @returns True if there are handlers, false otherwise
   */
  hasHandlers(eventType: string): boolean;
  
  /**
   * Get event bus statistics
   * @returns Current statistics
   */
  getStats(): EventBusStats;
  
  /**
   * Reset statistics
   */
  resetStats(): void;
}

/**
 * Event middleware interface
 * Allows intercepting and modifying events before they reach handlers
 */
export interface IEventMiddleware {
  /**
   * Process an event before it's published to handlers
   * @param event The event to process
   * @param next Function to call the next middleware or handlers
   * @returns Promise that resolves when processing is complete
   */
  process(
    event: IDomainEvent,
    next: (event: IDomainEvent) => Promise<EventPublicationResult>
  ): Promise<EventPublicationResult>;
  
  /** Name of the middleware for debugging */
  readonly name: string;
  
  /** Priority of the middleware (lower numbers execute first) */
  readonly priority: number;
}

/**
 * Event handler registry interface
 * Manages the mapping of event types to handlers
 */
export interface IEventHandlerRegistry {
  /**
   * Register a handler for an event type
   * @param eventType The event type
   * @param handler The handler function
   * @returns Subscription object
   */
  register<T extends IDomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): EventSubscription;
  
  /**
   * Unregister a subscription
   * @param subscription The subscription to remove
   */
  unregister(subscription: EventSubscription): void;
  
  /**
   * Get all handlers for an event type
   * @param eventType The event type
   * @returns Array of handlers
   */
  getHandlers(eventType: string): EventHandler[];
  
  /**
   * Get all registered event types
   * @returns Array of event types
   */
  getEventTypes(): string[];
  
  /**
   * Clear all registrations
   */
  clear(): void;
}

/**
 * Event queue interface for managing event processing
 */
export interface IEventQueue {
  /**
   * Add an event to the queue
   * @param event The event to queue
   */
  enqueue(event: IDomainEvent): void;
  
  /**
   * Remove and return the next event from the queue
   * @returns The next event or null if queue is empty
   */
  dequeue(): IDomainEvent | null;
  
  /**
   * Peek at the next event without removing it
   * @returns The next event or null if queue is empty
   */
  peek(): IDomainEvent | null;
  
  /**
   * Get the current queue size
   * @returns Number of events in the queue
   */
  size(): number;
  
  /**
   * Check if the queue is empty
   * @returns True if empty, false otherwise
   */
  isEmpty(): boolean;
  
  /**
   * Clear all events from the queue
   */
  clear(): void;
}
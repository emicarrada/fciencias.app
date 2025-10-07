import type { IEventBus, EventBusConfig } from './EventBusInterfaces';
import { InMemoryEventBus } from './InMemoryEventBus';
import { 
  MiddlewareEventBus,
  LoggingMiddleware,
  ValidationMiddleware,
  RetryMiddleware,
  AnalyticsMiddleware
} from './EventMiddleware';

/**
 * Event bus factory configuration
 */
export interface EventBusFactoryConfig extends EventBusConfig {
  /** Type of event bus to create */
  type?: 'basic' | 'middleware';
  
  /** Whether to enable built-in logging middleware */
  enableLogging?: boolean;
  
  /** Whether to enable built-in validation middleware */
  enableValidation?: boolean;
  
  /** Whether to enable built-in retry middleware */
  enableRetry?: boolean;
  
  /** Whether to enable built-in analytics middleware */
  enableAnalytics?: boolean;
  
  /** Retry configuration */
  retryConfig?: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
  };
  
  /** Custom logger function */
  customLogger?: (message: string, level: 'info' | 'warn' | 'error') => void;
}

/**
 * Factory for creating configured event bus instances
 */
export class EventBusFactory {
  /**
   * Create a basic event bus without middleware
   */
  static createBasic(config: EventBusConfig = {}): IEventBus {
    return new InMemoryEventBus(config);
  }

  /**
   * Create an event bus with middleware support
   */
  static createWithMiddleware(config: EventBusFactoryConfig = {}): MiddlewareEventBus {
    const eventBus = new MiddlewareEventBus(config);

    // Add built-in middlewares based on configuration
    if (config.enableValidation !== false) {
      eventBus.addMiddleware(new ValidationMiddleware());
    }

    if (config.enableLogging !== false) {
      eventBus.addMiddleware(new LoggingMiddleware(config.customLogger));
    }

    if (config.enableRetry) {
      const retryConfig = config.retryConfig || {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000
      };
      
      eventBus.addMiddleware(new RetryMiddleware(
        retryConfig.maxRetries,
        retryConfig.baseDelay,
        retryConfig.maxDelay
      ));
    }

    if (config.enableAnalytics) {
      eventBus.addMiddleware(new AnalyticsMiddleware());
    }

    return eventBus;
  }

  /**
   * Create a development event bus with all features enabled
   */
  static createDevelopment(): MiddlewareEventBus {
    return EventBusFactory.createWithMiddleware({
      enableLogging: true,
      enableValidation: true,
      enableRetry: true,
      enableAnalytics: true,
      executeInParallel: false, // Easier debugging
      catchHandlerErrors: true,
      handlerTimeout: 10000, // Longer timeout for debugging
      customLogger: (message, level) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
      }
    });
  }

  /**
   * Create a production event bus with optimized settings
   */
  static createProduction(): MiddlewareEventBus {
    return EventBusFactory.createWithMiddleware({
      enableLogging: false, // Disable console logging
      enableValidation: true,
      enableRetry: true,
      enableAnalytics: true,
      executeInParallel: true,
      catchHandlerErrors: true,
      handlerTimeout: 5000,
      maxHandlersPerEvent: 100,
      retryConfig: {
        maxRetries: 2,
        baseDelay: 500,
        maxDelay: 5000
      }
    });
  }

  /**
   * Create a testing event bus with minimal overhead
   */
  static createTesting(): IEventBus {
    return EventBusFactory.createBasic({
      enableLogging: false,
      executeInParallel: false, // Deterministic execution order
      catchHandlerErrors: false, // Let errors bubble up for testing
      handlerTimeout: 1000
    });
  }

  /**
   * Create an event bus based on environment
   */
  static createForEnvironment(environment: 'development' | 'production' | 'test'): IEventBus {
    switch (environment) {
      case 'development':
        return EventBusFactory.createDevelopment();
      case 'production':
        return EventBusFactory.createProduction();
      case 'test':
        return EventBusFactory.createTesting();
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  }
}

/**
 * Default event bus configurations for different scenarios
 */
export const EventBusConfigs = {
  /**
   * High-performance configuration for heavy event loads
   */
  highPerformance: {
    executeInParallel: true,
    maxHandlersPerEvent: 200,
    handlerTimeout: 3000,
    catchHandlerErrors: true,
    enableLogging: false
  } satisfies EventBusConfig,

  /**
   * Safe configuration with extensive error handling
   */
  safe: {
    executeInParallel: false,
    maxHandlersPerEvent: 20,
    handlerTimeout: 10000,
    catchHandlerErrors: true,
    enableLogging: true
  } satisfies EventBusConfig,

  /**
   * Debug configuration with detailed logging
   */
  debug: {
    executeInParallel: false,
    maxHandlersPerEvent: 10,
    handlerTimeout: 30000,
    catchHandlerErrors: true,
    enableLogging: true,
    logger: (message: string, level: 'info' | 'warn' | 'error') => {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [EventBus] ${message}`;
      
      switch (level) {
        case 'info':
          console.log(`\x1b[36m${formattedMessage}\x1b[0m`); // Cyan
          break;
        case 'warn':
          console.warn(`\x1b[33m${formattedMessage}\x1b[0m`); // Yellow
          break;
        case 'error':
          console.error(`\x1b[31m${formattedMessage}\x1b[0m`); // Red
          break;
      }
    }
  } satisfies EventBusConfig,

  /**
   * Minimal configuration for simple use cases
   */
  minimal: {
    executeInParallel: true,
    maxHandlersPerEvent: 5,
    handlerTimeout: 2000,
    catchHandlerErrors: true,
    enableLogging: false
  } satisfies EventBusConfig
};

/**
 * Singleton event bus manager
 * Provides a global event bus instance
 */
export class EventBusManager {
  private static instance: IEventBus | null = null;
  private static environment: 'development' | 'production' | 'test' = 'development';

  /**
   * Initialize the global event bus
   */
  static initialize(environment: 'development' | 'production' | 'test' = 'development'): void {
    EventBusManager.environment = environment;
    EventBusManager.instance = EventBusFactory.createForEnvironment(environment);
  }

  /**
   * Get the global event bus instance
   */
  static getInstance(): IEventBus {
    if (!EventBusManager.instance) {
      EventBusManager.initialize();
    }
    
    return EventBusManager.instance!;
  }

  /**
   * Replace the global event bus instance
   */
  static setInstance(eventBus: IEventBus): void {
    EventBusManager.instance = eventBus;
  }

  /**
   * Clear the global event bus instance
   */
  static clear(): void {
    if (EventBusManager.instance) {
      EventBusManager.instance.clear();
      EventBusManager.instance = null;
    }
  }

  /**
   * Get the current environment
   */
  static getEnvironment(): 'development' | 'production' | 'test' {
    return EventBusManager.environment;
  }
}
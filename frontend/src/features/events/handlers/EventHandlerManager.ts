import type { IEventBus } from '../infrastructure/EventBusInterfaces';
import { ServiceLocator } from '../../../di/ServiceRegistry';

// Import all handler registration functions
import { registerNotificationHandlers } from './NotificationHandlers';
import { registerAnalyticsHandlers } from './AnalyticsHandlers';
import { registerCacheHandlers } from './CacheHandlers';

/**
 * Handler group configuration
 */
export interface HandlerGroupConfig {
  enabled: boolean;
  priority: number;
  description: string;
}

/**
 * Event handler manager configuration
 */
export interface EventHandlerManagerConfig {
  notifications: HandlerGroupConfig;
  analytics: HandlerGroupConfig;
  cache: HandlerGroupConfig;
  autoRegister: boolean;
}

/**
 * Default configuration for different environments
 */
export const DefaultHandlerConfigs = {
  development: {
    notifications: { enabled: true, priority: 1, description: 'Development notifications' },
    analytics: { enabled: true, priority: 2, description: 'Development analytics' },
    cache: { enabled: true, priority: 3, description: 'Development cache' },
    autoRegister: true,
  } satisfies EventHandlerManagerConfig,

  production: {
    notifications: { enabled: true, priority: 1, description: 'Production notifications' },
    analytics: { enabled: true, priority: 2, description: 'Production analytics' },
    cache: { enabled: true, priority: 3, description: 'Production cache' },
    autoRegister: true,
  } satisfies EventHandlerManagerConfig,

  test: {
    notifications: { enabled: false, priority: 1, description: 'Test notifications (disabled)' },
    analytics: { enabled: false, priority: 2, description: 'Test analytics (disabled)' },
    cache: { enabled: false, priority: 3, description: 'Test cache (disabled)' },
    autoRegister: false,
  } satisfies EventHandlerManagerConfig,
};

/**
 * Event handler manager
 * Manages registration and lifecycle of event handlers
 */
export class EventHandlerManager {
  private eventBus: IEventBus;
  private config: EventHandlerManagerConfig;
  private registeredGroups = new Set<string>();

  constructor(
    eventBus?: IEventBus,
    config?: EventHandlerManagerConfig
  ) {
    this.eventBus = eventBus || ServiceLocator.getEventBus();
    
    // Default to development config
    const environment = (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'development';
    this.config = config || DefaultHandlerConfigs[environment as keyof typeof DefaultHandlerConfigs] || DefaultHandlerConfigs.development;

    if (this.config.autoRegister) {
      this.registerAllHandlers();
    }
  }

  /**
   * Register all enabled handler groups
   */
  registerAllHandlers(): void {
    console.log('[EventHandlerManager] Starting handler registration...');

    const groups = [
      { name: 'notifications', config: this.config.notifications, register: registerNotificationHandlers },
      { name: 'analytics', config: this.config.analytics, register: registerAnalyticsHandlers },
      { name: 'cache', config: this.config.cache, register: registerCacheHandlers },
    ];

    // Sort by priority
    groups.sort((a, b) => a.config.priority - b.config.priority);

    for (const group of groups) {
      if (group.config.enabled) {
        this.registerHandlerGroup(group.name, group.register, group.config);
      } else {
        console.log(`[EventHandlerManager] Skipping disabled group: ${group.name}`);
      }
    }

    console.log(`[EventHandlerManager] Registration complete. Active groups: ${Array.from(this.registeredGroups).join(', ')}`);
  }

  /**
   * Register a specific handler group
   */
  registerHandlerGroup(
    groupName: string,
    registerFunction: (eventBus: IEventBus) => void,
    config: HandlerGroupConfig
  ): void {
    try {
      if (this.registeredGroups.has(groupName)) {
        console.warn(`[EventHandlerManager] Group ${groupName} already registered`);
        return;
      }

      console.log(`[EventHandlerManager] Registering ${groupName} handlers (priority: ${config.priority})`);
      
      registerFunction(this.eventBus);
      this.registeredGroups.add(groupName);
      
      console.log(`[EventHandlerManager] ✅ ${groupName} handlers registered successfully`);
    } catch (error) {
      console.error(`[EventHandlerManager] ❌ Failed to register ${groupName} handlers:`, error);
    }
  }

  /**
   * Unregister all handlers (mainly for testing)
   */
  unregisterAllHandlers(): void {
    console.log('[EventHandlerManager] Unregistering all handlers...');
    
    this.eventBus.clear();
    this.registeredGroups.clear();
    
    console.log('[EventHandlerManager] All handlers unregistered');
  }

  /**
   * Get registration status
   */
  getRegistrationStatus(): {
    totalGroups: number;
    registeredGroups: string[];
    enabledGroups: string[];
    config: EventHandlerManagerConfig;
  } {
    const enabledGroups = [];
    
    if (this.config.notifications.enabled) enabledGroups.push('notifications');
    if (this.config.analytics.enabled) enabledGroups.push('analytics');
    if (this.config.cache.enabled) enabledGroups.push('cache');

    return {
      totalGroups: 3,
      registeredGroups: Array.from(this.registeredGroups),
      enabledGroups,
      config: this.config,
    };
  }

  /**
   * Get event bus statistics
   */
  getEventBusStats() {
    return this.eventBus.getStats();
  }

  /**
   * Test handler registration by publishing sample events
   */
  async testHandlers(): Promise<void> {
    console.log('[EventHandlerManager] Testing handlers with sample events...');

    try {
      // Import events for testing
      const { PostCreatedEvent } = await import('../domain/PostEvents');
      const { UserRegisteredEvent } = await import('../domain/UserEvents');
      const { PostReactionAddedEvent } = await import('../domain/ReactionEvents');
      const { Post } = await import('../../../domain/entities/Post');
      const { Reaction, ReactionType } = await import('../../../domain/value-objects/Reaction');
      const { Career, UserRole } = await import('../../../types/auth');

      // Create sample user
      const sampleUser = {
        id: 'test_user_123',
        email: 'test@fciencias.unam.mx',
        firstName: 'Test',
        lastName: 'User',
        career: Career.MATEMATICAS,
        semester: 5,
        role: UserRole.STUDENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create sample post
      const samplePost = new Post(
        'test_post_123',
        'Este es un post de prueba para testing de handlers',
        sampleUser,
        new Date(),
        new Date(),
        undefined,
        ['testing', 'handlers']
      );

      // Test events
      const events = [
        new UserRegisteredEvent(sampleUser, 'email'),
        new PostCreatedEvent(samplePost),
        new PostReactionAddedEvent(
          'test_post_123',
          'test_user_123',
          'test_reactor_456',
          new Reaction(
            'reaction_test_123',
            'test_post_123', 
            'test_reactor_456',
            ReactionType.LIKE,
            new Date()
          )
        ),
      ];

      for (const event of events) {
        console.log(`[EventHandlerManager] Publishing test event: ${event.eventType}`);
        const result = await this.eventBus.publish(event);
        
        console.log(`[EventHandlerManager] Event result: ${result.handlersExecuted} handlers executed, ${result.handlersFailed} failed`);
        
        if (result.errors.length > 0) {
          console.warn('[EventHandlerManager] Test event errors:', result.errors);
        }
      }

      console.log('[EventHandlerManager] Handler testing completed');
    } catch (error) {
      console.error('[EventHandlerManager] Handler testing failed:', error);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EventHandlerManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[EventHandlerManager] Configuration updated');
  }

  /**
   * Get current configuration
   */
  getConfig(): EventHandlerManagerConfig {
    return { ...this.config };
  }
}

/**
 * Global event handler manager instance
 */
let globalHandlerManager: EventHandlerManager | null = null;

/**
 * Initialize global event handler manager
 */
export function initializeEventHandlers(
  eventBus?: IEventBus,
  config?: EventHandlerManagerConfig
): EventHandlerManager {
  if (globalHandlerManager) {
    console.warn('[EventHandlerManager] Global manager already initialized');
    return globalHandlerManager;
  }

  globalHandlerManager = new EventHandlerManager(eventBus, config);
  console.log('[EventHandlerManager] Global manager initialized');
  
  return globalHandlerManager;
}

/**
 * Get global event handler manager
 */
export function getEventHandlerManager(): EventHandlerManager {
  if (!globalHandlerManager) {
    globalHandlerManager = initializeEventHandlers();
  }
  
  return globalHandlerManager;
}

/**
 * Clear global event handler manager (mainly for testing)
 */
export function clearEventHandlerManager(): void {
  if (globalHandlerManager) {
    globalHandlerManager.unregisterAllHandlers();
    globalHandlerManager = null;
    console.log('[EventHandlerManager] Global manager cleared');
  }
}

/**
 * Quick setup functions for different environments
 */
export const EventHandlerSetup = {
  development: () => initializeEventHandlers(undefined, DefaultHandlerConfigs.development),
  production: () => initializeEventHandlers(undefined, DefaultHandlerConfigs.production),
  test: () => initializeEventHandlers(undefined, DefaultHandlerConfigs.test),
  
  custom: (config: EventHandlerManagerConfig) => initializeEventHandlers(undefined, config),
  
  withEventBus: (eventBus: IEventBus, environment: keyof typeof DefaultHandlerConfigs = 'development') => 
    initializeEventHandlers(eventBus, DefaultHandlerConfigs[environment]),
};

// Auto-initialize for non-test environments
if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
  const environment = (process.env.NODE_ENV as keyof typeof DefaultHandlerConfigs) || 'development';
  
  try {
    initializeEventHandlers(undefined, DefaultHandlerConfigs[environment]);
  } catch (error) {
    console.error('[EventHandlerManager] Auto-initialization failed:', error);
  }
}
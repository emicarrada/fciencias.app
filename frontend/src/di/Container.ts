/**
 * Simple IoC Container for dependency injection
 */
export class Container {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();
  private factories = new Map<string, () => any>();

  /**
   * Register a service instance
   */
  register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation);
  }

  /**
   * Register a singleton service with factory function
   */
  singleton<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  /**
   * Resolve a service by token
   */
  resolve<T>(token: string): T {
    // Check if it's a singleton
    if (this.factories.has(token)) {
      if (!this.singletons.has(token)) {
        const factory = this.factories.get(token)!;
        this.singletons.set(token, factory());
      }
      return this.singletons.get(token);
    }

    // Check if it's a registered service
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    throw new Error(`Service with token "${token}" not found`);
  }

  /**
   * Check if a service is registered
   */
  has(token: string): boolean {
    return this.services.has(token) || this.factories.has(token);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }

  /**
   * Get all registered service tokens
   */
  getTokens(): string[] {
    return [
      ...Array.from(this.services.keys()),
      ...Array.from(this.factories.keys())
    ];
  }
}
/**
 * Service tokens for type-safe dependency injection
 */
export const SERVICE_TOKENS = {
  // Storage services
  STORAGE_SERVICE: 'storageService',
  MEMORY_STORAGE_SERVICE: 'memoryStorageService',
  
  // HTTP client
  API_CLIENT: 'apiClient',
  
  // Auth service
  AUTH_SERVICE: 'authService',
  
  // Repository services
  POST_REPOSITORY: 'postRepository',
  REACTION_REPOSITORY: 'reactionRepository',
  
  // Event system
  EVENT_BUS: 'eventBus',
  
  // Use Cases
  LOGIN_USE_CASE: 'loginUseCase',
  REGISTER_USE_CASE: 'registerUseCase',
  LOGOUT_USE_CASE: 'logoutUseCase',
  CREATE_POST_USE_CASE: 'createPostUseCase',
  REACT_TO_POST_USE_CASE: 'reactToPostUseCase',
  GET_POSTS_USE_CASE: 'getPostsUseCase',
  
  // Configuration
  API_BASE_URL: 'apiBaseUrl',
} as const;

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];
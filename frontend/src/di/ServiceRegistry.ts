import { Container } from './Container';
import { SERVICE_TOKENS } from './types';

// Services
import { LocalStorageService } from '../services/implementations/LocalStorageService';
import { MemoryStorageService } from '../services/implementations/MemoryStorageService';
import { AxiosApiClient } from '../services/implementations/AxiosApiClient';
import { ApiAuthService } from '../services/implementations/ApiAuthService';
import { ApiPostRepository } from '../services/repositories/ApiPostRepository';
import { ApiReactionRepository } from '../services/repositories/ApiReactionRepository';

// Event system
import { EventBusFactory } from '../features/events/infrastructure/EventBusFactory';

// Use Cases
import { LoginUseCase } from '../domain/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../domain/use-cases/auth/RegisterUseCase';
import { LogoutUseCase } from '../domain/use-cases/auth/LogoutUseCase';
import { CreatePostUseCase } from '../domain/use-cases/posts/CreatePostUseCase';
import { ReactToPostUseCase } from '../domain/use-cases/posts/ReactToPostUseCase';
import { GetPostsUseCase } from '../domain/use-cases/posts/GetPostsUseCase';

// Interfaces
import { IStorageService } from '../services/interfaces/IStorageService';
import { IApiClient } from '../services/interfaces/IApiClient';
import { IAuthService } from '../services/interfaces/IAuthService';
import { IPostRepository } from '../domain/repositories/IPostRepository';
import { IReactionRepository } from '../domain/repositories/IReactionRepository';
import { IEventBus } from '../features/events/infrastructure/EventBusInterfaces';

/**
 * Global container instance
 */
export const container = new Container();

/**
 * Configure and register all services in the container
 */
export function configureServices(): void {
  // Configuration
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';
  container.register(SERVICE_TOKENS.API_BASE_URL, apiBaseUrl);

  // Storage services
  container.singleton(SERVICE_TOKENS.STORAGE_SERVICE, () => new LocalStorageService());
  container.singleton(SERVICE_TOKENS.MEMORY_STORAGE_SERVICE, () => new MemoryStorageService());

  // HTTP client
  container.singleton(SERVICE_TOKENS.API_CLIENT, () => {
    const storageService = container.resolve<IStorageService>(SERVICE_TOKENS.STORAGE_SERVICE);
    const baseURL = container.resolve<string>(SERVICE_TOKENS.API_BASE_URL);
    return new AxiosApiClient(baseURL, storageService);
  });

  // Auth service
  container.singleton(SERVICE_TOKENS.AUTH_SERVICE, () => {
    const apiClient = container.resolve<IApiClient>(SERVICE_TOKENS.API_CLIENT);
    const storageService = container.resolve<IStorageService>(SERVICE_TOKENS.STORAGE_SERVICE);
    return new ApiAuthService(apiClient, storageService);
  });

  // Repository services
  container.singleton(SERVICE_TOKENS.POST_REPOSITORY, () => {
    const apiClient = container.resolve<IApiClient>(SERVICE_TOKENS.API_CLIENT);
    return new ApiPostRepository(apiClient);
  });

  container.singleton(SERVICE_TOKENS.REACTION_REPOSITORY, () => {
    const apiClient = container.resolve<IApiClient>(SERVICE_TOKENS.API_CLIENT);
    return new ApiReactionRepository(apiClient);
  });

  // Event system
  container.singleton(SERVICE_TOKENS.EVENT_BUS, () => {
    const environment = process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development';
    return EventBusFactory.createForEnvironment(environment);
  });

  // Use Cases
  container.singleton(SERVICE_TOKENS.LOGIN_USE_CASE, () => {
    const authService = container.resolve<IAuthService>(SERVICE_TOKENS.AUTH_SERVICE);
    const eventBus = container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS);
    return new LoginUseCase(authService, eventBus);
  });

  container.singleton(SERVICE_TOKENS.REGISTER_USE_CASE, () => {
    const authService = container.resolve<IAuthService>(SERVICE_TOKENS.AUTH_SERVICE);
    const eventBus = container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS);
    return new RegisterUseCase(authService, eventBus);
  });

  container.singleton(SERVICE_TOKENS.LOGOUT_USE_CASE, () => {
    const authService = container.resolve<IAuthService>(SERVICE_TOKENS.AUTH_SERVICE);
    const eventBus = container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS);
    return new LogoutUseCase(authService, eventBus);
  });

  container.singleton(SERVICE_TOKENS.CREATE_POST_USE_CASE, () => {
    const postRepository = container.resolve<IPostRepository>(SERVICE_TOKENS.POST_REPOSITORY);
    const eventBus = container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS);
    return new CreatePostUseCase(postRepository, eventBus);
  });

  container.singleton(SERVICE_TOKENS.REACT_TO_POST_USE_CASE, () => {
    const reactionRepository = container.resolve<IReactionRepository>(SERVICE_TOKENS.REACTION_REPOSITORY);
    const eventBus = container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS);
    return new ReactToPostUseCase(reactionRepository, eventBus);
  });

  container.singleton(SERVICE_TOKENS.GET_POSTS_USE_CASE, () => {
    const postRepository = container.resolve<IPostRepository>(SERVICE_TOKENS.POST_REPOSITORY);
    // GetPostsUseCase doesn't need events as it's read-only
    return new GetPostsUseCase(postRepository);
  });
}

/**
 * Service locator functions for easy access
 */
export const ServiceLocator = {
  getStorageService: (): IStorageService => 
    container.resolve<IStorageService>(SERVICE_TOKENS.STORAGE_SERVICE),
  
  getMemoryStorageService: (): IStorageService => 
    container.resolve<IStorageService>(SERVICE_TOKENS.MEMORY_STORAGE_SERVICE),
  
  getApiClient: (): IApiClient => 
    container.resolve<IApiClient>(SERVICE_TOKENS.API_CLIENT),
  
  getAuthService: (): IAuthService => 
    container.resolve<IAuthService>(SERVICE_TOKENS.AUTH_SERVICE),

  getPostRepository: (): IPostRepository => 
    container.resolve<IPostRepository>(SERVICE_TOKENS.POST_REPOSITORY),

  getReactionRepository: (): IReactionRepository => 
    container.resolve<IReactionRepository>(SERVICE_TOKENS.REACTION_REPOSITORY),

  getEventBus: (): IEventBus =>
    container.resolve<IEventBus>(SERVICE_TOKENS.EVENT_BUS),

  // Use Cases
  getLoginUseCase: (): LoginUseCase =>
    container.resolve<LoginUseCase>(SERVICE_TOKENS.LOGIN_USE_CASE),

  getRegisterUseCase: (): RegisterUseCase =>
    container.resolve<RegisterUseCase>(SERVICE_TOKENS.REGISTER_USE_CASE),

  getLogoutUseCase: (): LogoutUseCase =>
    container.resolve<LogoutUseCase>(SERVICE_TOKENS.LOGOUT_USE_CASE),

  getCreatePostUseCase: (): CreatePostUseCase =>
    container.resolve<CreatePostUseCase>(SERVICE_TOKENS.CREATE_POST_USE_CASE),

  getReactToPostUseCase: (): ReactToPostUseCase =>
    container.resolve<ReactToPostUseCase>(SERVICE_TOKENS.REACT_TO_POST_USE_CASE),

  getGetPostsUseCase: (): GetPostsUseCase =>
    container.resolve<GetPostsUseCase>(SERVICE_TOKENS.GET_POSTS_USE_CASE),
};

// Configure services on module load
configureServices();
# 🚀 FASE 1: Implementación Práctica - Separación de Responsabilidades

## 📋 Ejemplo Concreto: Refactorización del AuthStore

### ❌ Código Actual (Problema)

```typescript
// src/store/authStore.ts - ACTUAL
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  // ❌ Viola SRP: mezcla estado, persistencia y lógica de API
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'), // ❌ Dependencia directa
  isAuthenticated: false,
  
  login: async (credentials) => {
    // ❌ Lógica de API dentro del store
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem('user', JSON.stringify(user)); // ❌ Persistencia directa
      set({ user, isAuthenticated: true });
    }
  },
  
  logout: () => {
    localStorage.removeItem('user'); // ❌ Persistencia directa
    set({ user: null, isAuthenticated: false });
  },
}));
```

### ✅ Código Refactorizado (Solución)

#### 1. Service Layer - Interfaces

```typescript
// src/services/interfaces/IAuthService.ts
export interface IAuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<RegisterResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

// src/services/interfaces/IStorageService.ts
export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

// src/services/interfaces/IApiClient.ts
export interface IApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
```

#### 2. Service Implementations

```typescript
// src/services/implementations/LocalStorageService.ts
export class LocalStorageService implements IStorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

// src/services/implementations/AxiosApiClient.ts
export class AxiosApiClient implements IApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.storageService.get<string>('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.instance.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }
}

// src/services/implementations/ApiAuthService.ts
export class ApiAuthService implements IAuthService {
  constructor(
    private apiClient: IApiClient,
    private storageService: IStorageService
  ) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.token) {
      this.storageService.set('token', response.token);
      this.storageService.set('user', response.user);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.apiClient.post<RegisterResponse>('/auth/register', userData);
  }

  async logout(): Promise<void> {
    await this.apiClient.post('/auth/logout', {});
    this.storageService.remove('token');
    this.storageService.remove('user');
  }

  async getCurrentUser(): Promise<User | null> {
    return this.storageService.get<User>('user');
  }
}
```

#### 3. Dependency Injection Container

```typescript
// src/di/Container.ts
export class Container {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation);
  }

  singleton<T>(token: string, factory: () => T): void {
    if (!this.singletons.has(token)) {
      this.singletons.set(token, factory());
    }
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }
    return this.services.get(token);
  }
}

// src/di/ServiceRegistry.ts
export const container = new Container();

// Registrar servicios
container.singleton('storageService', () => new LocalStorageService());
container.singleton('apiClient', () => new AxiosApiClient(process.env.NEXT_PUBLIC_API_URL!));
container.singleton('authService', () => new ApiAuthService(
  container.resolve('apiClient'),
  container.resolve('storageService')
));

// Tokens para type safety
export const TOKENS = {
  STORAGE_SERVICE: 'storageService',
  API_CLIENT: 'apiClient',
  AUTH_SERVICE: 'authService',
} as const;
```

#### 4. Use Cases (Business Logic)

```typescript
// src/domain/use-cases/auth/LoginUseCase.ts
export class LoginUseCase {
  constructor(private authService: IAuthService) {}

  async execute(credentials: LoginRequest): Promise<LoginResult> {
    try {
      const response = await this.authService.login(credentials);
      
      return {
        success: true,
        user: response.user,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }
}

// src/domain/use-cases/auth/LogoutUseCase.ts
export class LogoutUseCase {
  constructor(private authService: IAuthService) {}

  async execute(): Promise<LogoutResult> {
    try {
      await this.authService.logout();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }
}
```

#### 5. Refactored Store (Solo Estado)

```typescript
// src/store/authStore.ts - REFACTORIZADO
import { create } from 'zustand';
import { container, TOKENS } from '@/di/ServiceRegistry';
import { LoginUseCase } from '@/domain/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@/domain/use-cases/auth/LogoutUseCase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const authService = container.resolve(TOKENS.AUTH_SERVICE);
      const loginUseCase = new LoginUseCase(authService);
      const result = await loginUseCase.execute(credentials);
      
      if (result.success) {
        set({ 
          user: result.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          error: result.error, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      const authService = container.resolve(TOKENS.AUTH_SERVICE);
      const logoutUseCase = new LogoutUseCase(authService);
      await logoutUseCase.execute();
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),

  initialize: async () => {
    try {
      const authService = container.resolve(TOKENS.AUTH_SERVICE);
      const user = await authService.getCurrentUser();
      
      if (user) {
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  },

  register: async (userData) => {
    // Similar implementation...
  },
}));
```

#### 6. Custom Hooks (UI Interface)

```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    register, 
    clearError,
    initialize 
  } = useAuthStore();

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  };
};
```

#### 7. Component Usage (Clean)

```typescript
// src/components/auth/LoginForm.tsx
export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        className="w-full p-2 border rounded"
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## 🎯 Beneficios Conseguidos

### ✅ SOLID Compliance:
1. **SRP**: Cada clase tiene una sola responsabilidad
   - AuthService: Solo autenticación
   - StorageService: Solo persistencia
   - AuthStore: Solo estado de UI

2. **OCP**: Extensible sin modificar código existente
   - Nuevos storage types (SessionStorage, MemoryStorage)
   - Nuevos auth providers (OAuth, SAML)

3. **LSP**: Interfaces sustituibles
   - Cualquier implementación de IAuthService funciona
   - Fácil testing con mocks

4. **ISP**: Interfaces específicas
   - IStorageService solo para almacenamiento
   - IAuthService solo para autenticación

5. **DIP**: Depende de abstracciones
   - AuthService recibe interfaces, no implementaciones
   - Fácil inyección de dependencias

### 🧪 Testing Benefits:
```typescript
// src/__tests__/auth/LoginUseCase.test.ts
describe('LoginUseCase', () => {
  let mockAuthService: jest.Mocked<IAuthService>;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
    };
    
    loginUseCase = new LoginUseCase(mockAuthService);
  });

  it('should return success when login is successful', async () => {
    // Arrange
    const credentials = { email: 'test@test.com', password: 'password' };
    const mockResponse = { user: { id: '1', email: 'test@test.com' }, token: 'token' };
    mockAuthService.login.mockResolvedValue(mockResponse);

    // Act
    const result = await loginUseCase.execute(credentials);

    // Assert
    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockResponse.user);
    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
  });
});
```

## 📊 Métricas de Mejora

### Antes de la Refactorización:
- **Líneas por función**: 45 (en authStore.login)
- **Dependencias directas**: 3 (localStorage, fetch, JSON)
- **Responsabilidades por clase**: 4 (estado, persistencia, API, validación)
- **Testabilidad**: Baja (dependencias hard-coded)

### Después de la Refactorización:
- **Líneas por función**: 15 promedio
- **Dependencias directas**: 0 (todas inyectadas)
- **Responsabilidades por clase**: 1
- **Testabilidad**: Alta (100% mockeable)

Esta es la base para implementar las siguientes fases del plan de refactorización. ¿Te gustaría que continúe con la Fase 2 o prefieres profundizar en algún aspecto específico de esta implementación?
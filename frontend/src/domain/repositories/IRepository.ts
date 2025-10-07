/**
 * Base repository interface for CRUD operations
 * Follows Repository pattern for data access abstraction
 */
export interface IRepository<T, ID = string, CreateData = any, UpdateData = any> {
  /**
   * Find entity by ID
   */
  findById(id: ID): Promise<T | null>;
  
  /**
   * Find all entities with optional pagination
   */
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>;
  
  /**
   * Create new entity
   */
  create(data: CreateData): Promise<T>;
  
  /**
   * Update existing entity
   */
  update(id: ID, updates: UpdateData): Promise<T>;
  
  /**
   * Delete entity by ID
   */
  delete(id: ID): Promise<void>;
  
  /**
   * Check if entity exists
   */
  exists(id: ID): Promise<boolean>;
}

/**
 * Pagination options for queries
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Query filter interface
 */
export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

/**
 * Advanced query options
 */
export interface QueryOptions extends PaginationOptions {
  filters?: QueryFilter[];
  includes?: string[];
}
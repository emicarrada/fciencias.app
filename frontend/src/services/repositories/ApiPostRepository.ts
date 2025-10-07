import { IPostRepository, CreatePostData, UpdatePostData, PostWithReactions } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';
import { PaginatedResult, QueryOptions } from '@/domain/repositories/IRepository';
import { IApiClient } from '@/services/interfaces/IApiClient';

/**
 * API implementation of IPostRepository
 * Handles post data through HTTP API calls
 */
export class ApiPostRepository implements IPostRepository {
  constructor(private apiClient: IApiClient) {}

  async findById(id: string): Promise<Post | null> {
    try {
      const data = await this.apiClient.get<any>(`/posts/${id}`);
      return data ? Post.fromApiData(data) : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async create(data: CreatePostData): Promise<Post> {
    const response = await this.apiClient.post<any>('/posts', data);
    return Post.fromApiData(response);
  }

  async update(id: string, updates: UpdatePostData): Promise<Post> {
    const response = await this.apiClient.put<any>(`/posts/${id}`, updates);
    return Post.fromApiData(response);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/posts/${id}`);
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.apiClient.get(`/posts/${id}/exists`);
      return true;
    } catch {
      return false;
    }
  }

  async findByAuthor(authorId: string, options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/author/${authorId}?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findByTags(tags: string[], options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const tagsParam = tags.join(',');
    const data = await this.apiClient.get<any>(`/posts/tags/${tagsParam}?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findFromFollowedUsers(userId: string, options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/feed/${userId}?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findTrending(options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/trending?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async search(query: string, options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/search?q=${encodeURIComponent(query)}&${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findMostReacted(options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/most-reacted?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findByCareer(career: string, options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/career/${career}?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findInDateRange(
    startDate: Date, 
    endDate: Date, 
    options?: QueryOptions
  ): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    const data = await this.apiClient.get<any>(`/posts/date-range?start=${start}&end=${end}&${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  async findWithReactions(postId: string): Promise<PostWithReactions | null> {
    try {
      const data = await this.apiClient.get<any>(`/posts/${postId}/with-reactions`);
      return {
        post: Post.fromApiData(data.post),
        reactions: data.reactions
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findDrafts(userId: string, options?: QueryOptions): Promise<PaginatedResult<Post>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/posts/drafts/${userId}?${params}`);
    
    return {
      data: data.posts.map((post: any) => Post.fromApiData(post)),
      pagination: data.pagination
    };
  }

  private buildQueryParams(options?: QueryOptions): string {
    if (!options) return '';
    
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    
    if (options.filters) {
      options.filters.forEach((filter, index) => {
        params.append(`filters[${index}][field]`, filter.field);
        params.append(`filters[${index}][operator]`, filter.operator);
        params.append(`filters[${index}][value]`, filter.value.toString());
      });
    }
    
    if (options.includes) {
      params.append('includes', options.includes.join(','));
    }
    
    return params.toString();
  }
}
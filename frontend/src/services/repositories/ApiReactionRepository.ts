import { 
  IReactionRepository, 
  PostReactionStats, 
  UserReactionStats, 
  ReactionTypeStats 
} from '@/domain/repositories/IReactionRepository';
import { Reaction, ReactionType, ReactionSummary } from '@/domain/value-objects/Reaction';
import { PaginatedResult, QueryOptions } from '@/domain/repositories/IRepository';
import { IApiClient } from '@/services/interfaces/IApiClient';

/**
 * API implementation of IReactionRepository
 * Handles reaction data through HTTP API calls
 */
export class ApiReactionRepository implements IReactionRepository {
  constructor(private apiClient: IApiClient) {}

  async findById(id: string): Promise<Reaction | null> {
    try {
      const data = await this.apiClient.get<any>(`/reactions/${id}`);
      return data ? Reaction.fromApiData(data) : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findAll(options?: QueryOptions): Promise<PaginatedResult<Reaction>> {
    const params = this.buildQueryParams(options);
    const data = await this.apiClient.get<any>(`/reactions?${params}`);
    
    return {
      data: data.reactions.map((reaction: any) => Reaction.fromApiData(reaction)),
      pagination: data.pagination
    };
  }

  async create(data: any): Promise<Reaction> {
    const response = await this.apiClient.post<any>('/reactions', data);
    return Reaction.fromApiData(response);
  }

  async update(id: string, updates: any): Promise<Reaction> {
    const response = await this.apiClient.put<any>(`/reactions/${id}`, updates);
    return Reaction.fromApiData(response);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/reactions/${id}`);
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.apiClient.get(`/reactions/${id}/exists`);
      return true;
    } catch {
      return false;
    }
  }

  async findByPost(postId: string): Promise<Reaction[]> {
    const data = await this.apiClient.get<any[]>(`/reactions/post/${postId}`);
    return data.map(reaction => Reaction.fromApiData(reaction));
  }

  async findUserReaction(postId: string, userId: string): Promise<Reaction | null> {
    try {
      const data = await this.apiClient.get<any>(`/reactions/post/${postId}/user/${userId}`);
      return data ? Reaction.fromApiData(data) : null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Reaction[]> {
    const data = await this.apiClient.get<any[]>(`/reactions/user/${userId}`);
    return data.map(reaction => Reaction.fromApiData(reaction));
  }

  async getPostSummary(postId: string, userId?: string): Promise<ReactionSummary> {
    const url = userId 
      ? `/reactions/post/${postId}/summary?userId=${userId}`
      : `/reactions/post/${postId}/summary`;
    
    const data = await this.apiClient.get<any>(url);
    
    const reactions = new Map<ReactionType, number>();
    Object.entries(data.reactions).forEach(([type, count]) => {
      reactions.set(type as ReactionType, count as number);
    });
    
    return new ReactionSummary(
      postId,
      reactions,
      data.totalCount,
      data.userReaction as ReactionType | undefined
    );
  }

  async getPostsSummaries(postIds: string[], userId?: string): Promise<Map<string, ReactionSummary>> {
    const url = userId 
      ? `/reactions/posts/summaries?userId=${userId}`
      : `/reactions/posts/summaries`;
    
    const data = await this.apiClient.post<any>(url, { postIds });
    
    const summaries = new Map<string, ReactionSummary>();
    
    Object.entries(data).forEach(([postId, summaryData]: [string, any]) => {
      const reactions = new Map<ReactionType, number>();
      Object.entries(summaryData.reactions).forEach(([type, count]) => {
        reactions.set(type as ReactionType, count as number);
      });
      
      summaries.set(postId, new ReactionSummary(
        postId,
        reactions,
        summaryData.totalCount,
        summaryData.userReaction as ReactionType | undefined
      ));
    });
    
    return summaries;
  }

  async reactToPost(postId: string, userId: string, type: ReactionType): Promise<Reaction> {
    const data = await this.apiClient.post<any>(`/reactions/post/${postId}`, {
      userId,
      type
    });
    
    return Reaction.fromApiData(data);
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    await this.apiClient.delete(`/reactions/post/${postId}/user/${userId}`);
  }

  async getMostReactedPosts(
    startDate: Date, 
    endDate: Date, 
    limit: number = 10
  ): Promise<PostReactionStats[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    
    const data = await this.apiClient.get<any[]>(
      `/reactions/stats/most-reacted?start=${start}&end=${end}&limit=${limit}`
    );
    
    return data.map(item => ({
      postId: item.postId,
      totalReactions: item.totalReactions,
      reactionsByType: item.reactionsByType,
      score: item.score
    }));
  }

  async getUserStats(userId: string): Promise<UserReactionStats> {
    const data = await this.apiClient.get<any>(`/reactions/stats/user/${userId}`);
    
    return {
      userId: data.userId,
      totalReactionsGiven: data.totalReactionsGiven,
      totalReactionsReceived: data.totalReactionsReceived,
      favoriteReactionType: data.favoriteReactionType as ReactionType,
      reactionsByType: data.reactionsByType
    };
  }

  async getTrendingReactionTypes(days: number = 7): Promise<ReactionTypeStats[]> {
    const data = await this.apiClient.get<any[]>(`/reactions/stats/trending?days=${days}`);
    
    return data.map(item => ({
      type: item.type as ReactionType,
      count: item.count,
      percentage: item.percentage
    }));
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
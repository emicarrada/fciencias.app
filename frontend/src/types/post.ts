/**
 * Tipos para el sistema de posts/anuncios
 */

// ========== TIPOS SIMPLES PARA POST MINIMALISTA ==========
export interface SimplePost {
  id: string;
  content: string;
  imageUrl: string | null;
  isAnonymous: boolean;
  author: {
    username: string | null;
    avatarColor: string | null;
  } | null;
  createdAt: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  isAnonymous?: boolean;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post?: SimplePost;
  requiresVerification?: boolean;
  requiresUsername?: boolean;
  error?: string;
}

export interface FeedResponse {
  success: boolean;
  posts: SimplePost[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

// ========== TIPOS LEGACY (mantener por compatibilidad) ==========
export type PostCategory = 
  | 'GENERAL'
  | 'EVENTO'
  | 'ACADEMICO'
  | 'SERVICIO_SOCIAL'
  | 'OPORTUNIDAD';

export type ReactionType = 
  | 'LIKE'
  | 'LOVE'
  | 'HAHA'
  | 'WOW'
  | 'SAD'
  | 'ANGRY';

export interface PostAuthor {
  id: string;
  username: string | null;
  email: string;
  avatarColor: string | null;
  career: string | null;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  announcementId: string;
  createdAt: string;
  user: {
    id: string;
    username: string | null;
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  announcementId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string | null;
    email: string;
    avatarColor: string | null;
  };
  reactions?: Reaction[];
  _count?: {
    reactions: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  status: string;
  tags: string[];
  authorId: string;
  isPublic: boolean;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  comments?: Comment[];
  reactions?: Reaction[];
  _count: {
    comments: number;
    reactions: number;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: PostCategory;
  tags?: string[];
  isPublic?: boolean;
}

export interface CreateReactionRequest {
  type: ReactionType;
}

export interface CreateCommentRequest {
  content: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostResponse {
  post: Post;
}

export interface CommentsResponse {
  comments: Comment[];
}

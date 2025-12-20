export enum NewsStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface NewsImage {
  id: string;
  url: string;
  newsId: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  status: NewsStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: NewsImage[];
}

export interface CreateNewsRequest {
  title: string;
  summary?: string;
  content?: string;
  imageIds?: string[];
  status?: NewsStatus;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {}

export interface NewsListParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: NewsStatus;
}

export interface NewsListResponse {
  page: number;
  limit: number;
  total: number;
  items: News[];
}

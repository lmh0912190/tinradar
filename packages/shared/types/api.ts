import type { RadarData, StoryData } from './radar.js';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface RadarApiResponse {
  trends: RadarData['trends'];
  stats: RadarData['stats'];
  updatedAt: string;
}

export interface StoryApiResponse {
  story: StoryData;
  updatedAt: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  count: number;
}

export interface CategoriesApiResponse {
  categories: CategoryItem[];
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  db: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
  lastTrendsFetch: string | null;
  lastBatchCompleted: string | null;
  activeTrends: number;
}

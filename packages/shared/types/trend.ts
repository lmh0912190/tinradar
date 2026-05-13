export interface Trend {
  id: number;
  keyword: string;
  slug: string;
  traffic: number;
  category: string | null;
  pictureUrl: string | null;
  pictureSource: string | null;
  trendDate: string;
  firstSeenAt: string;
  lastSeenAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  trendId: number;
  title: string;
  sourceName: string;
  sourceUrl: string | null;
  articleUrl: string;
  googleUrl: string | null;
  snippet: string | null;
  pictureUrl: string | null;
  publishedAt: string | null;
  fetchedAt: string;
  createdAt: string;
}

export interface Story {
  id: number;
  trendId: number;
  slug: string;
  keyword: string;
  category: string | null;
  summary: string | null;
  traffic: number;
  articleCount: number;
  sourceCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  aiModel: string | null;
  aiBatchId: string | null;
  aiGeneratedAt: string | null;
  isPublished: boolean;
  firstPublishedAt: string;
  createdAt: string;
  updatedAt: string;
}

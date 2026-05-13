export interface RadarTrend {
  id: number;
  keyword: string;
  slug: string;
  traffic: number;
  category: string;
  articleCount: number;
  topSource: string | null;
  pubDate: string | null;
  pictureUrl: string | null;
}

export interface RadarStats {
  totalTrends: number;
  totalSearches: number;
  totalSources: number;
}

export interface RadarData {
  trends: RadarTrend[];
  stats: RadarStats;
  updatedAt: string;
}

export interface StoryArticle {
  id: number;
  title: string;
  sourceName: string;
  sourceUrl: string | null;
  articleUrl: string;
  snippet: string | null;
  publishedAt: string | null;
}

export interface StoryData {
  keyword: string;
  slug: string;
  category: string | null;
  traffic: number;
  summary: string | null;
  articles: StoryArticle[];
  articleCount: number;
  sourceCount: number;
  updatedAt: string;
}

export type SortMode = 'traffic' | 'time';
export type CategorySlug =
  | 'tat-ca'
  | 'kinh-doanh'
  | 'tai-chinh'
  | 'the-thao'
  | 'cong-nghe'
  | 'xa-hoi'
  | 'giai-tri'
  | 'doi-song';

import type { RadarApiResponse, StoryApiResponse, CategoriesApiResponse } from '@trend-radar/shared';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getRadarData(params?: {
  category?: string;
  sort?: 'traffic' | 'time';
}): Promise<RadarApiResponse> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== 'tat-ca') qs.set('category', params.category);
  if (params?.sort) qs.set('sort', params.sort);
  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<RadarApiResponse>(`/api/v1/radar${query}`, { next: { revalidate: 300 } });
}

export async function getStoryData(slug: string): Promise<StoryApiResponse> {
  return apiFetch<StoryApiResponse>(`/api/v1/stories/${slug}`, { next: { revalidate: 600 } });
}

export async function getCategories(): Promise<CategoriesApiResponse> {
  return apiFetch<CategoriesApiResponse>('/api/v1/categories', { next: { revalidate: 1800 } });
}

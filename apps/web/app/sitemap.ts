import type { MetadataRoute } from 'next';
import { getRadarData } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://trendradar.vn';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    ...CATEGORIES.filter((c) => c.slug !== 'tat-ca').map((c) => ({
      url: `${siteUrl}/danh-muc/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
  ];

  try {
    const data = await getRadarData();
    const storyRoutes: MetadataRoute.Sitemap = data.trends.map((t) => ({
      url: `${siteUrl}/xu-huong/${t.slug}`,
      lastModified: new Date(t.pubDate ?? Date.now()),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    }));
    return [...staticRoutes, ...storyRoutes];
  } catch {
    return staticRoutes;
  }
}

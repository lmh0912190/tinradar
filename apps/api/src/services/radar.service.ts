import { db, trends, articles } from '@trend-radar/db';
import { eq, desc, and, inArray } from 'drizzle-orm';
import type { RadarData } from '@trend-radar/shared';

export async function buildRadarData(categoryName?: string): Promise<RadarData> {
  // Get top 2 distinct trend dates from active trends (newest first)
  const topDates = await db
    .selectDistinct({ trendDate: trends.trendDate })
    .from(trends)
    .where(eq(trends.isActive, true))
    .orderBy(desc(trends.trendDate))
    .limit(2);

  if (topDates.length === 0) {
    return {
      trends: [],
      stats: { totalTrends: 0, totalSearches: 0, totalSources: 0 },
      updatedAt: new Date().toISOString(),
    };
  }

  const dates = topDates.map((r) => r.trendDate);

  // Fetch trends from those 2 dates, newest date first, then by traffic desc
  const conditions = [eq(trends.isActive, true), inArray(trends.trendDate, dates)];
  if (categoryName) conditions.push(eq(trends.category, categoryName));

  const rows = await db
    .select({
      id: trends.id,
      keyword: trends.keyword,
      slug: trends.slug,
      traffic: trends.traffic,
      category: trends.category,
      pictureUrl: trends.pictureUrl,
      lastSeenAt: trends.lastSeenAt,
      trendDate: trends.trendDate,
    })
    .from(trends)
    .where(and(...conditions))
    .orderBy(desc(trends.trendDate), desc(trends.traffic))
    .limit(30);

  if (rows.length === 0) {
    return {
      trends: [],
      stats: { totalTrends: 0, totalSearches: 0, totalSources: 0 },
      updatedAt: new Date().toISOString(),
    };
  }

  const trendIds = rows.map((r) => r.id);

  const allArticles = await db
    .select({
      trendId: articles.trendId,
      sourceName: articles.sourceName,
      title: articles.title,
      articleUrl: articles.articleUrl,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(inArray(articles.trendId, trendIds))
    .orderBy(articles.trendId, desc(articles.publishedAt));

  const articlesByTrend = new Map<number, typeof allArticles>();
  const allSourceNames = new Set<string>();

  for (const art of allArticles) {
    if (!articlesByTrend.has(art.trendId)) articlesByTrend.set(art.trendId, []);
    articlesByTrend.get(art.trendId)!.push(art);
    allSourceNames.add(art.sourceName);
  }

  const totalSearches = rows.reduce((sum, r) => sum + r.traffic, 0);

  return {
    trends: rows.map((r) => {
      const trendArticles = articlesByTrend.get(r.id) ?? [];
      return {
        id: r.id,
        keyword: r.keyword,
        slug: r.slug,
        traffic: r.traffic,
        category: r.category ?? '',
        articleCount: trendArticles.length,
        topSource: trendArticles[0]?.sourceName ?? null,
        pubDate: r.lastSeenAt.toISOString(),
        pictureUrl: r.pictureUrl,
        previewArticles: trendArticles.slice(0, 3).map((a) => ({
          title: a.title,
          sourceName: a.sourceName,
          articleUrl: a.articleUrl,
          publishedAt: a.publishedAt?.toISOString() ?? null,
        })),
      };
    }),
    stats: {
      totalTrends: rows.length,
      totalSearches,
      totalSources: allSourceNames.size,
    },
    updatedAt: new Date().toISOString(),
  };
}

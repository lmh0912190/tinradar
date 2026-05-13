import { db, trends, articles, stories } from '@trend-radar/db';
import { eq, desc, and, countDistinct, count } from 'drizzle-orm';
import type { RadarData } from '@trend-radar/shared';

export async function buildRadarData(categoryName?: string): Promise<RadarData> {
  const conditions = [eq(trends.isActive, true)];
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
      articleCount: count(articles.id),
    })
    .from(trends)
    .leftJoin(articles, eq(articles.trendId, trends.id))
    .where(and(...conditions))
    .groupBy(trends.id)
    .orderBy(desc(trends.traffic))
    .limit(50);

  const trendIds = rows.map((r) => r.id);

  const topSources: Map<number, string> = new Map();
  if (trendIds.length > 0) {
    for (const row of rows) {
      const art = await db
        .select({ sourceName: articles.sourceName })
        .from(articles)
        .where(eq(articles.trendId, row.id))
        .orderBy(desc(articles.publishedAt))
        .limit(1);
      if (art[0]) topSources.set(row.id, art[0].sourceName);
    }
  }

  const totalSearches = rows.reduce((sum, r) => sum + r.traffic, 0);

  const allSources = await db
    .selectDistinct({ sourceName: articles.sourceName })
    .from(articles)
    .innerJoin(trends, and(eq(articles.trendId, trends.id), eq(trends.isActive, true)));

  return {
    trends: rows.map((r) => ({
      id: r.id,
      keyword: r.keyword,
      slug: r.slug,
      traffic: r.traffic,
      category: r.category ?? 'Xã hội',
      articleCount: Number(r.articleCount),
      topSource: topSources.get(r.id) ?? null,
      pubDate: r.lastSeenAt.toISOString(),
      pictureUrl: r.pictureUrl,
    })),
    stats: {
      totalTrends: rows.length,
      totalSearches,
      totalSources: allSources.length,
    },
    updatedAt: new Date().toISOString(),
  };
}

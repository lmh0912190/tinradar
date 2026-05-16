import { db, trends, articles } from '@trend-radar/db';
import { eq, and, desc, gte, lt, sql } from 'drizzle-orm';
import { generateSlug } from '@trend-radar/shared';
import { classifyByHeuristic } from '../utils/category-classifier.js';
import { logger } from '../utils/logger.js';

export interface UpsertTrendInput {
  keyword: string;
  traffic: number;
  pictureUrl: string | null;
  pictureSource: string | null;
  pubDate: string | null;
}

export async function upsertTrend(input: UpsertTrendInput): Promise<number> {
  const today = new Date().toISOString().split('T')[0]!;
  const slug = generateSlug(input.keyword);

  const existing = await db
    .select({ id: trends.id })
    .from(trends)
    .where(eq(trends.slug, slug))
    .limit(1);

  if (existing.length > 0 && existing[0]) {
    await db.update(trends).set({
      traffic: input.traffic,
      lastSeenAt: new Date(),
      isActive: true,
      updatedAt: new Date(),
      pictureUrl: input.pictureUrl,
      pictureSource: input.pictureSource,
    }).where(eq(trends.id, existing[0].id));
    return existing[0].id;
  }

  const heuristicCategory = classifyByHeuristic(input.keyword, input.pictureSource);

  const inserted = await db.insert(trends).values({
    keyword: input.keyword,
    slug,
    traffic: input.traffic,
    trendDate: today,
    pictureUrl: input.pictureUrl,
    pictureSource: input.pictureSource,
    category: heuristicCategory,
  }).returning({ id: trends.id });

  return inserted[0]!.id;
}

export interface UpsertArticleInput {
  trendId: number;
  title: string;
  sourceName: string;
  sourceUrl: string | null;
  articleUrl: string;
  googleUrl: string | null;
  snippet: string | null;
  publishedAt: string | null;
}

export async function upsertArticles(inputs: UpsertArticleInput[]): Promise<void> {
  for (const input of inputs) {
    try {
      await db.insert(articles).values({
        trendId: input.trendId,
        title: input.title,
        sourceName: input.sourceName,
        sourceUrl: input.sourceUrl,
        articleUrl: input.articleUrl,
        googleUrl: input.googleUrl,
        snippet: input.snippet,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      }).onConflictDoUpdate({
        target: [articles.trendId, articles.articleUrl],
        set: {
          title: input.title,
          snippet: input.snippet,
          fetchedAt: new Date(),
        },
      });
    } catch (err) {
      logger.warn('Article upsert failed', { event: 'article_upsert_fail', url: input.articleUrl, error: String(err) });
    }
  }
}

export async function getActiveTrends(categoryName?: string) {
  const conditions = [eq(trends.isActive, true)];
  if (categoryName) conditions.push(eq(trends.category, categoryName));

  return db
    .select()
    .from(trends)
    .where(and(...conditions))
    .orderBy(desc(trends.traffic))
    .limit(50);
}

export async function deactivateOldTrends(): Promise<number> {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const result = await db
    .update(trends)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(trends.isActive, true), lt(trends.lastSeenAt, cutoff)));
  return (result as unknown as { rowCount: number }).rowCount ?? 0;
}

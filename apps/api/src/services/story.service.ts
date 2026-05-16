import { db, stories, articles, trends } from '@trend-radar/db';
import { eq, desc, and } from 'drizzle-orm';
import { generateSlug } from '@trend-radar/shared';
import type { StoryData } from '@trend-radar/shared';
import { logger } from '../utils/logger.js';

export async function upsertStory(trendId: number, data: {
  keyword: string;
  slug: string;
  category: string | null;
  summary: string | null;
  traffic: number;
  articleCount: number;
  sourceCount: number;
  aiModel?: string;
  aiBatchId?: string;
}): Promise<void> {
  const existing = await db
    .select({ id: stories.id })
    .from(stories)
    .where(eq(stories.trendId, trendId))
    .limit(1);

  if (existing.length > 0 && existing[0]) {
    await db.update(stories).set({
      ...(data.category !== null ? { category: data.category } : {}),
      summary: data.summary,
      traffic: data.traffic,
      articleCount: data.articleCount,
      sourceCount: data.sourceCount,
      aiModel: data.aiModel ?? null,
      aiBatchId: data.aiBatchId ?? null,
      aiGeneratedAt: data.summary ? new Date() : undefined,
      updatedAt: new Date(),
      metaTitle: `${data.keyword} — Tin Radar`,
      metaDescription: data.summary?.substring(0, 310) ?? null,
    }).where(eq(stories.id, existing[0].id));
  } else {
    await db.insert(stories).values({
      trendId,
      slug: data.slug,
      keyword: data.keyword,
      category: data.category,
      summary: data.summary,
      traffic: data.traffic,
      articleCount: data.articleCount,
      sourceCount: data.sourceCount,
      aiModel: data.aiModel ?? null,
      aiBatchId: data.aiBatchId ?? null,
      aiGeneratedAt: data.summary ? new Date() : null,
      metaTitle: `${data.keyword} — Tin Radar`,
      metaDescription: data.summary?.substring(0, 310) ?? null,
    });
  }
}

export async function getStoryBySlug(slug: string): Promise<StoryData | null> {
  const story = await db
    .select()
    .from(stories)
    .where(and(eq(stories.slug, slug), eq(stories.isPublished, true)))
    .limit(1);

  if (!story[0]) return null;
  const s = story[0];

  const arts = await db
    .select()
    .from(articles)
    .where(eq(articles.trendId, s.trendId))
    .orderBy(desc(articles.publishedAt))
    .limit(20);

  return {
    keyword: s.keyword,
    slug: s.slug,
    category: s.category,
    traffic: s.traffic,
    summary: s.summary,
    articles: arts.map((a) => ({
      id: a.id,
      title: a.title,
      sourceName: a.sourceName,
      sourceUrl: a.sourceUrl,
      articleUrl: a.articleUrl,
      snippet: a.snippet,
      publishedAt: a.publishedAt?.toISOString() ?? null,
    })),
    articleCount: s.articleCount,
    sourceCount: s.sourceCount,
    updatedAt: s.updatedAt.toISOString(),
  };
}

export async function getTrendsNeedingStories(): Promise<Array<{ trendId: number; keyword: string; slug: string; traffic: number }>> {
  // Return active trends that either have no story, or whose story's AI summary predates
  // the most recent article (needs refresh). Use simple approach: all active trends,
  // ranked by traffic. The batch processor deduplicates in-flight work via Redis queue.
  const result = await db
    .select({
      trendId: trends.id,
      keyword: trends.keyword,
      slug: trends.slug,
      traffic: trends.traffic,
      aiGeneratedAt: stories.aiGeneratedAt,
    })
    .from(trends)
    .leftJoin(stories, eq(stories.trendId, trends.id))
    .where(eq(trends.isActive, true))
    .orderBy(desc(trends.traffic))
    .limit(50);

  return result
    .filter((r) => !r.aiGeneratedAt)
    .map((r) => ({
      trendId: r.trendId,
      keyword: r.keyword,
      slug: r.slug,
      traffic: r.traffic,
    }));
}

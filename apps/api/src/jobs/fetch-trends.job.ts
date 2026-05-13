import { fetchGoogleTrendsRss } from '../integrations/google-trends.js';
import { fetchGoogleNewsRss } from '../integrations/google-news.js';
import { upsertTrend, upsertArticles } from '../services/trend.service.js';
import { upsertStory } from '../services/story.service.js';
import { generateSlug } from '@trend-radar/shared';
import { cacheSet, cacheDel, cacheDelPattern, CACHE_KEYS, TTL, getRedis } from '../cache/redis.js';
import { db, articles as articlesTable, trends as trendsTable } from '@trend-radar/db';
import { eq, count } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

const RATE_LIMIT_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runFetchTrendsJob(): Promise<{ trendsCount: number; articlesCount: number }> {
  const start = Date.now();
  logger.info('fetch-trends job started', { event: 'job_start', service: 'cron' });

  const cacheKey = CACHE_KEYS.rssGoogleTrends;
  let trendItems = await (async () => {
    const cached = await (async () => {
      try { return JSON.parse((await getRedis().get(cacheKey)) ?? 'null'); } catch { return null; }
    })();
    if (cached) return cached;
    return null;
  })();

  if (!trendItems) {
    trendItems = await fetchGoogleTrendsRss();
    await cacheSet(cacheKey, trendItems, TTL.rssGoogleTrends);
  }

  let totalArticles = 0;

  for (const item of trendItems) {
    try {
      const trendId = await upsertTrend({
        keyword: item.keyword,
        traffic: item.traffic,
        pictureUrl: item.pictureUrl,
        pictureSource: item.pictureSource,
        pubDate: item.pubDate,
      });

      const existingCount = await db
        .select({ total: count(articlesTable.id) })
        .from(articlesTable)
        .where(eq(articlesTable.trendId, trendId));

      const isNew = Number(existingCount[0]?.total ?? 0) === 0;

      if (isNew) {
        const newsCacheKey = CACHE_KEYS.rssGoogleNews(generateSlug(item.keyword));
        let newsArticles = await (async () => {
          try { return JSON.parse((await getRedis().get(newsCacheKey)) ?? 'null'); } catch { return null; }
        })();

        if (!newsArticles) {
          await sleep(RATE_LIMIT_DELAY_MS);
          newsArticles = await fetchGoogleNewsRss(item.keyword);
          await cacheSet(newsCacheKey, newsArticles, TTL.rssGoogleNews);
        }

        await upsertArticles(newsArticles.map((a: { title: string; sourceName: string; sourceUrl: string | null; articleUrl: string; googleUrl: string; snippet: string | null; publishedAt: string | null }) => ({
          trendId,
          title: a.title,
          sourceName: a.sourceName,
          sourceUrl: a.sourceUrl,
          articleUrl: a.articleUrl,
          googleUrl: a.googleUrl,
          snippet: a.snippet,
          publishedAt: a.publishedAt,
        })));

        totalArticles += newsArticles.length;

        const artCount = newsArticles.length;
        const sources = new Set(newsArticles.map((a: { sourceName: string }) => a.sourceName)).size;
        const firstSnippet = newsArticles[0]?.snippet ?? null;

        await upsertStory(trendId, {
          keyword: item.keyword,
          slug: generateSlug(item.keyword),
          category: null,
          summary: firstSnippet,
          traffic: item.traffic,
          articleCount: artCount,
          sourceCount: sources,
        });

        await getRedis().lpush(CACHE_KEYS.aiPendingQueue, String(trendId));
      }
    } catch (err) {
      logger.error('Failed processing trend', { event: 'trend_fail', keyword: item.keyword, error: String(err) });
    }
  }

  await cacheDel(CACHE_KEYS.radarData);
  await cacheDel(CACHE_KEYS.categories);
  await cacheDelPattern('tr:radar:data:*');
  await getRedis().set(CACHE_KEYS.lastFetch, new Date().toISOString());

  const duration = Date.now() - start;
  logger.info('fetch-trends job completed', {
    event: 'job_complete', service: 'cron',
    duration_ms: duration,
    trends_count: trendItems.length,
    articles_count: totalArticles,
  });

  return { trendsCount: trendItems.length, articlesCount: totalArticles };
}

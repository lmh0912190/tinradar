import { db, articles as articlesTable } from '@trend-radar/db';
import { eq, desc } from 'drizzle-orm';
import { getTrendsNeedingStories, upsertStory } from '../services/story.service.js';
import { submitBatch, type BatchRequest } from '../integrations/anthropic-batch.js';
import { db as _db, aiBatchJobs } from '@trend-radar/db';
import { getRedis, CACHE_KEYS } from '../cache/redis.js';
import { logger } from '../utils/logger.js';

export async function runProcessAiBatchJob(): Promise<{ submitted: number; batchId: string | null }> {
  const start = Date.now();

  const pending = await getTrendsNeedingStories();
  if (pending.length === 0) {
    logger.info('No trends pending AI processing', { event: 'batch_skip', service: 'ai-batch' });
    return { submitted: 0, batchId: null };
  }

  const requests: BatchRequest[] = [];

  for (const trend of pending.slice(0, 30)) {
    const arts = await db
      .select({ title: articlesTable.title, sourceName: articlesTable.sourceName, snippet: articlesTable.snippet })
      .from(articlesTable)
      .where(eq(articlesTable.trendId, trend.trendId))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(10);

    if (arts.length === 0) continue;

    requests.push({
      customId: `trend_${trend.trendId}`,
      trendId: trend.trendId,
      keyword: trend.keyword,
      traffic: trend.traffic,
      articles: arts.map((a) => ({ source: a.sourceName, title: a.title, snippet: a.snippet })),
    });
  }

  if (requests.length === 0) {
    return { submitted: 0, batchId: null };
  }

  const batchId = await submitBatch(requests);

  await _db.insert(aiBatchJobs).values({
    batchId,
    status: 'processing',
    totalRequests: requests.length,
  });

  await getRedis().set(CACHE_KEYS.currentBatch, batchId);

  logger.info('AI batch submitted', { event: 'batch_submit', service: 'ai-batch', batch_id: batchId, count: requests.length, duration_ms: Date.now() - start });
  return { submitted: requests.length, batchId };
}

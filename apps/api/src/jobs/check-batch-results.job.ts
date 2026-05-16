import { db, aiBatchJobs, articles as articlesTable } from '@trend-radar/db';
import { eq, desc } from 'drizzle-orm';
import { getBatchStatus, processBatchResults } from '../integrations/anthropic-batch.js';
import { upsertStory, getStoryBySlug } from '../services/story.service.js';
import { db as _db, trends } from '@trend-radar/db';
import { cacheDel, CACHE_KEYS } from '../cache/redis.js';
import { logger } from '../utils/logger.js';
import { generateSlug } from '@trend-radar/shared';

export async function runCheckBatchResultsJob(): Promise<{ processed: number }> {
  const pendingBatches = await db
    .select()
    .from(aiBatchJobs)
    .where(eq(aiBatchJobs.status, 'processing'))
    .orderBy(desc(aiBatchJobs.submittedAt))
    .limit(5);

  let totalProcessed = 0;

  for (const batch of pendingBatches) {
    try {
      const status = await getBatchStatus(batch.batchId);

      if (status.status !== 'ended') {
        logger.info('Batch still processing', { event: 'batch_poll', batch_id: batch.batchId, status: status.status });
        continue;
      }

      const requestMap = new Map<string, number>();
      const trendRows = await _db.select({ id: trends.id }).from(trends).where(eq(trends.isActive, true));
      for (const row of trendRows) {
        requestMap.set(`trend_${row.id}`, row.id);
      }

      const results = await processBatchResults(batch.batchId, requestMap);

      for (const result of results) {
        if (result.error || !result.summary) continue;

        const trendRow = await _db.select().from(trends).where(eq(trends.id, result.trendId)).limit(1);
        if (!trendRow[0]) continue;
        const t = trendRow[0];

        const arts = await db
          .select({ sourceName: articlesTable.sourceName })
          .from(articlesTable)
          .where(eq(articlesTable.trendId, result.trendId));

        const sources = new Set(arts.map((a) => a.sourceName)).size;

        await upsertStory(result.trendId, {
          keyword: t.keyword,
          slug: generateSlug(t.keyword),
          category: result.category,
          summary: result.summary,
          traffic: t.traffic,
          articleCount: arts.length,
          sourceCount: sources,
          aiModel: 'claude-haiku-4-5-20251001',
          aiBatchId: batch.batchId,
        });

        // Only overwrite if AI returned a valid category; preserve heuristic-set category otherwise.
        if (result.category) {
          await _db.update(trends).set({ category: result.category, updatedAt: new Date() }).where(eq(trends.id, result.trendId));
        }

        await cacheDel(CACHE_KEYS.story(generateSlug(t.keyword)));
        totalProcessed++;
      }

      await db.update(aiBatchJobs).set({
        status: 'completed',
        completedAt: new Date(),
        completedCount: status.requestCounts.succeeded,
        failedCount: status.requestCounts.errored,
      }).where(eq(aiBatchJobs.id, batch.id));

      await cacheDel(CACHE_KEYS.radarData);

    } catch (err) {
      logger.error('Batch results check failed', { event: 'batch_check_fail', batch_id: batch.batchId, error: String(err) });
      await db.update(aiBatchJobs).set({ status: 'failed', errorMessage: String(err) }).where(eq(aiBatchJobs.id, batch.id));
    }
  }

  return { processed: totalProcessed };
}

import cron from 'node-cron';
import { runFetchTrendsJob } from './fetch-trends.job.js';
import { runProcessAiBatchJob } from './process-ai-batch.job.js';
import { runCheckBatchResultsJob } from './check-batch-results.job.js';
import { runCleanupJob } from './cleanup.job.js';
import { db, cronLogs } from '@trend-radar/db';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

async function withCronLog(jobName: string, fn: () => Promise<unknown>): Promise<void> {
  const start = Date.now();
  const [log] = await db.insert(cronLogs).values({ jobName, status: 'started' }).returning({ id: cronLogs.id });
  try {
    const result = await fn();
    await db.update(cronLogs).set({
      status: 'completed',
      durationMs: Date.now() - start,
      completedAt: new Date(),
      metadata: result as Record<string, unknown>,
    }).where(eq(cronLogs.id, log!.id));
  } catch (err) {
    await db.update(cronLogs).set({
      status: 'failed',
      durationMs: Date.now() - start,
      completedAt: new Date(),
      errorMessage: String(err),
    }).where(eq(cronLogs.id, log!.id));
    logger.error(`Cron job failed: ${jobName}`, { event: 'cron_fail', job: jobName, error: String(err) });
  }
}

export function startScheduler(): void {
  cron.schedule('*/30 * * * *', () => withCronLog('fetch-trends', runFetchTrendsJob));

  cron.schedule('5-59/30 * * * *', () => withCronLog('process-ai-batch', runProcessAiBatchJob));

  cron.schedule('*/5 * * * *', () => withCronLog('check-batch-results', runCheckBatchResultsJob));

  cron.schedule('0 * * * *', () => withCronLog('cleanup', runCleanupJob));

  logger.info('Scheduler started', { event: 'scheduler_start', service: 'cron' });
}

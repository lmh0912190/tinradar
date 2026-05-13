import { db, cronLogs } from '@trend-radar/db';
import { deactivateOldTrends } from '../services/trend.service.js';
import { lt, eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

export async function runCleanupJob(): Promise<void> {
  const deactivated = await deactivateOldTrends();
  logger.info('Cleanup: deactivated old trends', { event: 'cleanup', count: deactivated });

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await db.delete(cronLogs).where(lt(cronLogs.startedAt, cutoff));
}

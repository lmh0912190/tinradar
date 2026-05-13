import type { FastifyInstance } from 'fastify';
import { db, trends } from '@trend-radar/db';
import { eq, count } from 'drizzle-orm';
import { getRedis, CACHE_KEYS } from '../../cache/redis.js';
import type { HealthResponse } from '@trend-radar/shared';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async (_request, reply) => {
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let activeTrends = 0;

    try {
      const result = await db.select({ total: count(trends.id) }).from(trends).where(eq(trends.isActive, true));
      activeTrends = Number(result[0]?.total ?? 0);
      dbStatus = 'connected';
    } catch {}

    let redisStatus: 'connected' | 'disconnected' = 'disconnected';
    let lastFetch: string | null = null;
    let lastBatch: string | null = null;

    try {
      const r = getRedis();
      await r.ping();
      redisStatus = 'connected';
      lastFetch = await r.get(CACHE_KEYS.lastFetch);
      lastBatch = await r.get(CACHE_KEYS.currentBatch);
    } catch {}

    const response: HealthResponse = {
      status: dbStatus === 'connected' && redisStatus === 'connected' ? 'ok' : 'degraded',
      db: dbStatus,
      redis: redisStatus,
      lastTrendsFetch: lastFetch,
      lastBatchCompleted: lastBatch,
      activeTrends,
    };

    return reply.send(response);
  });
}

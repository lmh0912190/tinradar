import { Redis } from 'ioredis';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    redis.on('error', (err: Error) => {
      logger.error('Redis error', { event: 'redis_error', error: String(err) });
    });
  }
  return redis;
}

export const CACHE_KEYS = {
  radarData: 'tr:radar:data',
  radarDataCategory: (cat: string) => `tr:radar:data:${cat}`,
  story: (slug: string) => `tr:story:${slug}`,
  categories: 'tr:categories',
  rssGoogleTrends: 'tr:rss:trends',
  rssGoogleNews: (slug: string) => `tr:rss:news:${slug}`,
  lastFetch: 'tr:last_fetch',
  currentBatch: 'tr:batch:current',
  aiPendingQueue: 'tr:queue:ai_pending',
} as const;

export const TTL = {
  radarData: 600,
  story: 900,
  categories: 1800,
  rssGoogleTrends: 1500,
  rssGoogleNews: 1200,
} as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await getRedis().get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await getRedis().setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    logger.warn('Cache set failed', { event: 'cache_set_fail', key, error: String(err) });
  }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) await getRedis().del(...keys);
  } catch (err) {
    logger.warn('Cache del failed', { event: 'cache_del_fail', error: String(err) });
  }
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    const r = getRedis();
    const keys = await r.keys(pattern);
    if (keys.length > 0) await r.del(...keys);
  } catch (err) {
    logger.warn('Cache del pattern failed', { event: 'cache_del_pattern_fail', error: String(err) });
  }
}

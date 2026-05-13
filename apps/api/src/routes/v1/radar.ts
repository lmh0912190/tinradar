import type { FastifyInstance } from 'fastify';
import { buildRadarData } from '../../services/radar.service.js';
import { CATEGORIES, getCategoryBySlug } from '@trend-radar/shared';
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from '../../cache/redis.js';
import type { RadarApiResponse } from '@trend-radar/shared';

export async function radarRoutes(app: FastifyInstance): Promise<void> {
  app.get<{
    Querystring: { category?: string; sort?: 'traffic' | 'time'; limit?: string };
  }>('/api/v1/radar', async (request, reply) => {
    const { category, sort = 'traffic', limit } = request.query;

    const catName = category && category !== 'tat-ca'
      ? getCategoryBySlug(category).name
      : undefined;

    const cacheKey = catName ? CACHE_KEYS.radarDataCategory(category ?? '') : CACHE_KEYS.radarData;
    const cached = await cacheGet<RadarApiResponse>(cacheKey);
    if (cached) return reply.send(cached);

    const data = await buildRadarData(catName);

    let trends = data.trends;
    if (sort === 'time') {
      trends = [...trends].sort((a, b) =>
        new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime()
      );
    }
    if (limit) {
      trends = trends.slice(0, parseInt(limit, 10));
    }

    const response: RadarApiResponse = {
      trends,
      stats: data.stats,
      updatedAt: data.updatedAt,
    };

    await cacheSet(cacheKey, response, TTL.radarData);
    return reply.send(response);
  });
}

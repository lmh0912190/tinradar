import type { FastifyInstance } from 'fastify';
import { getCategories } from '../../services/category.service.js';
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from '../../cache/redis.js';
import type { CategoriesApiResponse } from '@trend-radar/shared';

export async function categoriesRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/categories', async (_request, reply) => {
    const cached = await cacheGet<CategoriesApiResponse>(CACHE_KEYS.categories);
    if (cached) return reply.send(cached);

    const categories = await getCategories();
    const response: CategoriesApiResponse = { categories };

    await cacheSet(CACHE_KEYS.categories, response, TTL.categories);
    return reply.send(response);
  });
}

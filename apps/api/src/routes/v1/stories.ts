import type { FastifyInstance } from 'fastify';
import { getStoryBySlug } from '../../services/story.service.js';
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from '../../cache/redis.js';
import type { StoryApiResponse, StoryData } from '@trend-radar/shared';

export async function storiesRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { slug: string } }>('/api/v1/stories/:slug', async (request, reply) => {
    const { slug } = request.params;

    const cacheKey = CACHE_KEYS.story(slug);
    const cached = await cacheGet<StoryData>(cacheKey);
    if (cached) {
      return reply.send({ story: cached, updatedAt: cached.updatedAt } satisfies StoryApiResponse);
    }

    const story = await getStoryBySlug(slug);
    if (!story) return reply.status(404).send({ error: 'Story not found' });

    await cacheSet(cacheKey, story, TTL.story);
    return reply.send({ story, updatedAt: story.updatedAt } satisfies StoryApiResponse);
  });
}

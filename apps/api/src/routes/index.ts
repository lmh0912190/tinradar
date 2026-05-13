import type { FastifyInstance } from 'fastify';
import { radarRoutes } from './v1/radar.js';
import { storiesRoutes } from './v1/stories.js';
import { categoriesRoutes } from './v1/categories.js';
import { healthRoutes } from './internal/health.js';
import { jobsRoutes } from './internal/jobs.js';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(radarRoutes);
  await app.register(storiesRoutes);
  await app.register(categoriesRoutes);
  await app.register(healthRoutes);
  await app.register(jobsRoutes);
}

import type { FastifyInstance } from 'fastify';
import { internalAuth } from '../../middleware/auth.js';
import { runFetchTrendsJob } from '../../jobs/fetch-trends.job.js';
import { runProcessAiBatchJob } from '../../jobs/process-ai-batch.job.js';
import { runCheckBatchResultsJob } from '../../jobs/check-batch-results.job.js';

export async function jobsRoutes(app: FastifyInstance): Promise<void> {
  app.post('/internal/jobs/fetch-trends', { preHandler: internalAuth }, async (_req, reply) => {
    const result = await runFetchTrendsJob();
    return reply.send({ ok: true, ...result });
  });

  app.post('/internal/jobs/process-ai-batch', { preHandler: internalAuth }, async (_req, reply) => {
    const result = await runProcessAiBatchJob();
    return reply.send({ ok: true, ...result });
  });

  app.post('/internal/jobs/check-batch-results', { preHandler: internalAuth }, async (_req, reply) => {
    const result = await runCheckBatchResultsJob();
    return reply.send({ ok: true, ...result });
  });
}

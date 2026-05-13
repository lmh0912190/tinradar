import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { registerRoutes } from './routes/index.js';
import { startScheduler } from './jobs/scheduler.js';
import { getRedis } from './cache/redis.js';
import { logger } from './utils/logger.js';

const app = Fastify({
  logger: false,
  disableRequestLogging: true,
});

await app.register(cors, {
  origin: config.isDev ? true : [process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://trendradar.vn'],
  methods: ['GET', 'POST'],
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  skipOnError: true,
});

await registerRoutes(app);

app.addHook('onClose', async () => {
  const r = getRedis();
  await r.quit();
});

try {
  await app.listen({ port: config.port, host: config.host });
  logger.info(`API listening on ${config.host}:${config.port}`, { event: 'server_start', service: 'api' });
  startScheduler();
} catch (err) {
  logger.error('Failed to start server', { error: String(err) });
  process.exit(1);
}

export const config = {
  port: parseInt(process.env['API_PORT'] ?? '4001', 10),
  host: process.env['API_HOST'] ?? '0.0.0.0',
  databaseUrl: process.env['DATABASE_URL'] ?? 'postgresql://trendradar:trendradar@localhost:5432/trendradar',
  redisUrl: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  anthropicApiKey: process.env['ANTHROPIC_API_KEY'] ?? '',
  internalApiKey: process.env['INTERNAL_API_KEY'] ?? 'dev-internal-key',
  googleTrendsGeo: process.env['GOOGLE_TRENDS_GEO'] ?? 'VN',
  googleNewsHl: process.env['GOOGLE_NEWS_HL'] ?? 'vi',
  googleNewsGl: process.env['GOOGLE_NEWS_GL'] ?? 'VN',
  isDev: process.env['NODE_ENV'] !== 'production',
} as const;

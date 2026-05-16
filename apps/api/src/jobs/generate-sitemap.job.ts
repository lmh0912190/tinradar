import { logger } from '../utils/logger.js';

export async function runGenerateSitemapJob(): Promise<void> {
  // Next.js App Router serves /sitemap.xml dynamically from app/sitemap.ts.
  // If NEXT_REVALIDATE_SECRET is set, trigger ISR revalidation so Google sees fresh URLs.
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'];
  const secret = process.env['NEXT_REVALIDATE_SECRET'];

  if (!siteUrl || !secret) {
    logger.info('Sitemap revalidation skipped (NEXT_REVALIDATE_SECRET not configured)', {
      event: 'sitemap_skip',
      service: 'cron',
    });
    return;
  }

  try {
    const res = await fetch(`${siteUrl}/api/revalidate?secret=${secret}&path=/sitemap.xml`);
    logger.info('Sitemap revalidation triggered', {
      event: 'sitemap_revalidate',
      service: 'cron',
      status: res.status,
    });
  } catch (err) {
    logger.warn('Sitemap revalidation failed', { event: 'sitemap_fail', error: String(err) });
  }
}

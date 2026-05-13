import { generateSlug } from '@trend-radar/shared';
import { db, trends } from '@trend-radar/db';
import { eq } from 'drizzle-orm';

export async function generateUniqueSlug(keyword: string, context?: string): Promise<string> {
  let slug = generateSlug(keyword, context);

  const existing = await db.select({ slug: trends.slug }).from(trends).where(eq(trends.slug, slug));

  if (existing.length > 0) {
    const dateSuffix = new Date().toISOString().split('T')[0];
    slug = `${slug}-${dateSuffix}`.substring(0, 80);
  }

  return slug;
}

import { db, trends } from '@trend-radar/db';
import { eq, count, and } from 'drizzle-orm';
import type { CategoryItem } from '@trend-radar/shared';

export async function getCategories(): Promise<CategoryItem[]> {
  const rows = await db
    .select({ category: trends.category, total: count(trends.id) })
    .from(trends)
    .where(eq(trends.isActive, true))
    .groupBy(trends.category);

  return rows
    .filter((r) => r.category != null)
    .map((r) => ({
      slug: slugifyCategory(r.category!),
      name: r.category!,
      count: Number(r.total),
    }));
}

function slugifyCategory(name: string): string {
  const map: Record<string, string> = {
    'Kinh doanh': 'kinh-doanh',
    'Tài chính': 'tai-chinh',
    'Thể thao': 'the-thao',
    'Công nghệ': 'cong-nghe',
    'Xã hội': 'xa-hoi',
    'Giải trí': 'giai-tri',
    'Đời sống': 'doi-song',
  };
  return map[name] ?? name.toLowerCase().replace(/\s+/g, '-');
}

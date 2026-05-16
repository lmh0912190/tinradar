export { formatTraffic, timeAgo, formatViDate } from '@trend-radar/shared';
import { CATEGORIES, getCategoryByName } from './constants';

export function getCategoryColor(categoryName: string, trendId: number) {
  const cat = getCategoryByName(categoryName);
  if (cat.slug !== 'tat-ca') return cat;
  const colorCats = CATEGORIES.slice(1);
  return colorCats[trendId % colorCats.length]!;
}

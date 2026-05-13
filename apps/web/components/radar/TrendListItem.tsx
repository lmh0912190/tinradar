import Link from 'next/link';
import type { RadarTrend } from '@trend-radar/shared';
import { formatTraffic, timeAgo } from '@/lib/utils';
import { getCategoryByName } from '@/lib/constants';
import { CategoryBadge } from '@/components/shared/CategoryBadge';

interface TrendListItemProps {
  trend: RadarTrend;
  rank: number;
}

export function TrendListItem({ trend, rank }: TrendListItemProps) {
  const cat = getCategoryByName(trend.category);

  return (
    <Link
      href={`/xu-huong/${trend.slug}`}
      className="trend-list-item"
      style={{ '--item-accent': cat.accent } as React.CSSProperties}
    >
      <span className="trend-list-item__rank">{rank}</span>
      <div
        className="trend-list-item__bar"
        style={{ background: `linear-gradient(to bottom, ${cat.accent}, ${cat.accent}60)` }}
      />
      <div className="trend-list-item__info">
        <div className="trend-list-item__title">{trend.keyword}</div>
        <div className="trend-list-item__meta">
          <CategoryBadge name={trend.category} small />
          {trend.articleCount > 0 && (
            <span>{trend.articleCount} bài viết</span>
          )}
          {trend.topSource && (
            <span style={{ color: 'var(--text-subtle)' }}>{trend.topSource}</span>
          )}
        </div>
      </div>
      <div className="trend-list-item__traffic">
        <div className="trend-list-item__traffic-num">{formatTraffic(trend.traffic)}</div>
        <div className="trend-list-item__time">{timeAgo(trend.pubDate)}</div>
      </div>
      <span className="trend-list-item__chevron">›</span>
    </Link>
  );
}

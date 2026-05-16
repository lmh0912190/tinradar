'use client';

import { useRouter } from 'next/navigation';
import type { RadarTrend } from '@trend-radar/shared';
import { formatTraffic, timeAgo, getCategoryColor } from '@/lib/utils';
import { getSourceColor } from '@trend-radar/shared';
import { CategoryBadge } from '@/components/shared/CategoryBadge';

interface TrendListItemProps {
  trend: RadarTrend;
  rank: number;
  pct: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function TrendListItem({ trend, rank, pct, isOpen, onToggle }: TrendListItemProps) {
  const router = useRouter();
  const cat = getCategoryColor(trend.category, trend.id);
  const barFill = Math.min(pct * 3.2, 100);
  const isEven = rank % 2 === 0;

  return (
    <div className={`accordion-row${isOpen ? ' accordion-row--open' : ''}`}>
      <button
        className="accordion-row__header"
        style={{
          background: isOpen ? cat.bg : isEven ? 'var(--bg-card-alt)' : 'var(--bg-card)',
        }}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="accordion-row__rank">{rank}</span>
        <span className="accordion-row__bar" style={{ background: cat.accent }} />
        <div className="accordion-row__progress">
          <div className="accordion-row__progress-track">
            <div
              className="accordion-row__progress-fill"
              style={{ width: `${barFill}%`, background: cat.accent }}
            />
          </div>
          <span className="accordion-row__pct">{Math.round(pct)}%</span>
        </div>
        <span className="accordion-row__keyword">{trend.keyword}</span>
        <span className="accordion-row__cat-badge">
          <CategoryBadge name={trend.category} small />
        </span>
        <div className="accordion-row__traffic-col">
          <span className="accordion-row__traffic" style={{ color: cat.accent }}>
            {formatTraffic(trend.traffic)}
          </span>
          {trend.pubDate && (
            <span className="accordion-row__time">{timeAgo(trend.pubDate)}</span>
          )}
        </div>
        <span className="accordion-row__chevron" aria-hidden>▾</span>
      </button>

      <div className="accordion-row__content" aria-hidden={!isOpen}>
        <div className="accordion-row__news">
          {trend.previewArticles.length > 0
            ? trend.previewArticles.map((art, i) => (
                <div key={i} className="accordion-row__news-item">
                  <span className="accordion-row__dot" style={{ background: cat.accent }} />
                  <div>
                    <div className="accordion-row__news-title">{art.title}</div>
                    <div className="accordion-row__news-meta">
                      <span style={{ color: getSourceColor(art.sourceName), fontWeight: 600 }}>
                        {art.sourceName}
                      </span>
                      {art.publishedAt && <span>{timeAgo(art.publishedAt)}</span>}
                    </div>
                  </div>
                </div>
              ))
            : (
              <div className="accordion-row__news-item">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Đang tổng hợp tin tức...
                </span>
              </div>
            )}
        </div>
        <button
          className="accordion-row__btn"
          style={{ borderColor: `${cat.accent}50`, color: cat.accent }}
          onClick={() => router.push(`/xu-huong/${trend.slug}`)}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${cat.accent}18`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          Xem câu chuyện đầy đủ →
        </button>
      </div>
    </div>
  );
}

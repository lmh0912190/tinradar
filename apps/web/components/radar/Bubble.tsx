'use client';

import { useRouter } from 'next/navigation';
import type { RadarTrend } from '@trend-radar/shared';
import { formatTraffic, timeAgo, getCategoryColor } from '@/lib/utils';

interface BubbleProps {
  trend: RadarTrend;
  type: 'main' | 'secondary' | 'small' | 'extraSmall';
  pct: number;
}

function CellImage({ src, opacity }: { src: string; opacity: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

export function Bubble({ trend, type, pct }: BubbleProps) {
  const router = useRouter();
  const cat = getCategoryColor(trend.category, trend.id);
  const pctDisplay = Math.round(pct);
  const img = trend.pictureUrl;

  const navigate = () => {
    router.push(`/xu-huong/${trend.slug}`);
    window.scrollTo(0, 0);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const shadow = type === 'main'
      ? `0 8px 30px ${cat.accent}40`
      : type === 'secondary'
        ? `0 6px 20px ${cat.accent}40`
        : `0 4px 12px ${cat.accent}40`;
    e.currentTarget.style.boxShadow = shadow;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = '';
  };

  if (type === 'main') {
    const headline = trend.previewArticles[0]?.title ?? null;
    return (
      <button
        className="treemap-cell treemap-cell--main"
        onClick={navigate}
        title={trend.keyword}
        style={{ background: cat.accent }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {img && <CellImage src={img} opacity={0.22} />}
        <span className="treemap-cell__pct treemap-cell__pct--main">{pctDisplay}%</span>
        <span className="treemap-cell__cat">{trend.category}</span>
        <span className="treemap-cell__keyword treemap-cell__keyword--main">{trend.keyword}</span>
        <span className="treemap-cell__traffic">{formatTraffic(trend.traffic)} lượt tìm</span>
        {trend.pubDate && (
          <span className="treemap-cell__time">{timeAgo(trend.pubDate)}</span>
        )}
        {headline && <span className="treemap-cell__headline">{headline}</span>}
      </button>
    );
  }

  if (type === 'secondary') {
    return (
      <button
        className="treemap-cell treemap-cell--secondary"
        onClick={navigate}
        title={trend.keyword}
        style={{ background: cat.accent }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {img && <CellImage src={img} opacity={0.18} />}
        <span className="treemap-cell__pct treemap-cell__pct--secondary">{pctDisplay}%</span>
        <span className="treemap-cell__cat">{trend.category}</span>
        <span className="treemap-cell__keyword treemap-cell__keyword--secondary">{trend.keyword}</span>
        <span className="treemap-cell__traffic">{formatTraffic(trend.traffic)}</span>
      </button>
    );
  }

  if (type === 'small') {
    return (
      <button
        className="treemap-cell treemap-cell--small"
        onClick={navigate}
        title={trend.keyword}
        style={{ background: cat.accent }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {img && <CellImage src={img} opacity={0.15} />}
        <span className="treemap-cell__keyword treemap-cell__keyword--small">{trend.keyword}</span>
        <span className="treemap-cell__traffic">{formatTraffic(trend.traffic)}</span>
      </button>
    );
  }

  return (
    <button
      className="treemap-cell treemap-cell--extra-small"
      onClick={navigate}
      title={trend.keyword}
      style={{ background: cat.accent }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {img && <CellImage src={img} opacity={0.15} />}
      <span className="treemap-cell__keyword treemap-cell__keyword--small">{trend.keyword}</span>
      <span className="treemap-cell__traffic">{formatTraffic(trend.traffic)}</span>
    </button>
  );
}

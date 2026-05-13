'use client';

import { useRouter } from 'next/navigation';
import type { RadarTrend } from '@trend-radar/shared';
import { formatTraffic } from '@/lib/utils';
import { getCategoryByName } from '@/lib/constants';

interface BubbleProps {
  trend: RadarTrend;
  size: number;
  index: number;
}

export function Bubble({ trend, size, index }: BubbleProps) {
  const router = useRouter();
  const cat = getCategoryByName(trend.category);

  const fontSize = size < 100 ? 11 : size < 140 ? 13 : 15;

  return (
    <button
      className="bubble bubble--animate"
      onClick={() => router.push(`/xu-huong/${trend.slug}`)}
      title={trend.keyword}
      style={{
        width: size,
        height: size,
        background: cat.bg,
        border: `1.5px solid ${cat.accent}35`,
        color: cat.accent,
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${cat.accent}25`;
        (e.currentTarget as HTMLButtonElement).style.borderColor = cat.accent;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
        (e.currentTarget as HTMLButtonElement).style.borderColor = `${cat.accent}35`;
      }}
    >
      <span className="bubble__live" style={{ color: cat.accent }} />
      <span className="bubble__keyword" style={{ fontSize }}>{trend.keyword}</span>
      <span className="bubble__traffic">{formatTraffic(trend.traffic)}</span>
    </button>
  );
}

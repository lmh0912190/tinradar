'use client';

import { useState } from 'react';
import type { RadarTrend } from '@trend-radar/shared';
import { TrendListItem } from './TrendListItem';

interface TrendListProps {
  trends: RadarTrend[];
  totalSearches: number;
}

export function TrendList({ trends, totalSearches }: TrendListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (trends.length === 0) {
    return <div className="empty-state">Không có xu hướng nào trong danh mục này</div>;
  }

  const total = totalSearches > 0 ? totalSearches : trends.reduce((s, t) => s + t.traffic, 0);

  return (
    <div className="accordion-list">
      {trends.map((trend, i) => {
        const pct = total > 0 ? (trend.traffic / total) * 100 : 0;
        return (
          <TrendListItem
            key={trend.id}
            trend={trend}
            rank={i + 1}
            pct={pct}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        );
      })}
    </div>
  );
}

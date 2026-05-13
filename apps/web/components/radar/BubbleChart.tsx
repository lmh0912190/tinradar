'use client';

import type { RadarTrend } from '@trend-radar/shared';
import { Bubble } from './Bubble';
import { calcBubbleSize } from '@/lib/utils';

interface BubbleChartProps {
  trends: RadarTrend[];
}

export function BubbleChart({ trends }: BubbleChartProps) {
  if (trends.length === 0) {
    return <div className="empty-state">Không có xu hướng nào trong danh mục này</div>;
  }

  const maxTraffic = Math.max(...trends.map((t) => t.traffic), 1);

  return (
    <div className="bubble-chart">
      {trends.map((trend, i) => (
        <Bubble
          key={trend.id}
          trend={trend}
          size={calcBubbleSize(trend.traffic, maxTraffic)}
          index={i}
        />
      ))}
    </div>
  );
}

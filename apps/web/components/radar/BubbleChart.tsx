'use client';

import type { RadarTrend } from '@trend-radar/shared';
import { Bubble } from './Bubble';

interface BubbleChartProps {
  trends: RadarTrend[];
  totalSearches: number;
}

export function BubbleChart({ trends, totalSearches }: BubbleChartProps) {
  if (trends.length === 0) {
    return <div className="empty-state">Không có xu hướng nào trong danh mục này</div>;
  }

  const total = totalSearches > 0 ? totalSearches : trends.reduce((s, t) => s + t.traffic, 0);
  const pct = (t: RadarTrend) => (total > 0 ? (t.traffic / total) * 100 : 0);

  const [main, ...rest] = trends;
  const sec = rest.slice(0, 2);
  const small = rest.slice(2, 5);
  const extra = rest.slice(5, 13); // cap at 8 — more than that is unreadable

  return (
    <div className="treemap-container">
      <div className="treemap-grid">
        {main && (
          <div className="treemap-main-wrapper">
            <Bubble trend={main} type="main" pct={pct(main)} />
          </div>
        )}
        <div className="treemap-right-col">
          {sec.map((t) => (
            <Bubble key={t.id} trend={t} type="secondary" pct={pct(t)} />
          ))}
          {small.length > 0 && (
            <div className="treemap-small-group">
              {small.map((t) => (
                <Bubble key={t.id} trend={t} type="small" pct={pct(t)} />
              ))}
            </div>
          )}
        </div>
      </div>
      {extra.length > 0 && (
        <div className="treemap-extra-row">
          {extra.map((t) => (
            <Bubble key={t.id} trend={t} type="extraSmall" pct={pct(t)} />
          ))}
        </div>
      )}
    </div>
  );
}

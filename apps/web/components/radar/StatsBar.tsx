import type { RadarStats } from '@trend-radar/shared';
import { formatTraffic } from '@/lib/utils';

interface StatsBarProps {
  stats: RadarStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stats-bar__card">
        <div className="stats-bar__label">🔥 Đang trending</div>
        <div className="stats-bar__value">{stats.totalTrends}</div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">📊 Tổng lượt tìm</div>
        <div className="stats-bar__value">{formatTraffic(stats.totalSearches)}</div>
      </div>
      <div className="stats-bar__card">
        <div className="stats-bar__label">📰 Nguồn tin</div>
        <div className="stats-bar__value">{stats.totalSources}</div>
      </div>
    </div>
  );
}

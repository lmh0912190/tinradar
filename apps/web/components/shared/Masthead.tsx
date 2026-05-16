import type { RadarStats } from '@trend-radar/shared';
import { formatTraffic, formatViDate } from '@/lib/utils';
import { RadarLogo } from './RadarLogo';

interface MastheadProps {
  compact?: boolean;
  stats?: RadarStats;
}

export function Masthead({ compact, stats }: MastheadProps) {
  const dateStr = formatViDate(new Date().toISOString());

  if (compact) {
    return (
      <header className="masthead masthead--compact">
        <div className="masthead__brand">
          <RadarLogo size={28} />
          <div className="masthead__title" style={{ fontSize: 24 }}>Tin Radar</div>
        </div>
      </header>
    );
  }

  return (
    <header className="masthead">
      <div className="masthead__date">{dateStr}</div>
      <div className="masthead__title-row">
        <div className="masthead__left">
          <div className="masthead__brand">
            <RadarLogo size={44} />
            <h1 className="masthead__title">Tin Radar</h1>
          </div>
          <p className="masthead__subtitle">Bản đồ dư luận VN — Cập nhật mỗi giờ</p>
        </div>
        {stats && (
          <div className="masthead__stats">
            <span className="masthead__stat">🔥 <strong>{stats.totalTrends}</strong> xu hướng</span>
            <span className="masthead__stat-sep">·</span>
            <span className="masthead__stat">📊 <strong>{formatTraffic(stats.totalSearches)}</strong> lượt tìm</span>
            <span className="masthead__stat-sep">·</span>
            <span className="masthead__stat">📰 <strong>{stats.totalSources}</strong> nguồn</span>
          </div>
        )}
      </div>
    </header>
  );
}

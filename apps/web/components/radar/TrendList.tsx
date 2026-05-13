import type { RadarTrend } from '@trend-radar/shared';
import { TrendListItem } from './TrendListItem';

interface TrendListProps {
  trends: RadarTrend[];
}

export function TrendList({ trends }: TrendListProps) {
  if (trends.length === 0) {
    return <div className="empty-state">Không có xu hướng nào trong danh mục này</div>;
  }

  return (
    <div className="trend-list">
      {trends.map((trend, i) => (
        <TrendListItem key={trend.id} trend={trend} rank={i + 1} />
      ))}
    </div>
  );
}

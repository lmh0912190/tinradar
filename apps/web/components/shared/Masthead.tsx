import { formatViDate } from '@/lib/utils';

interface MastheadProps {
  compact?: boolean;
}

export function Masthead({ compact }: MastheadProps) {
  const dateStr = formatViDate(new Date().toISOString());

  if (compact) {
    return (
      <header className="masthead" style={{ padding: '16px 0 12px', marginBottom: 4 }}>
        <div className="masthead__title" style={{ fontSize: 28 }}>Tin Radar</div>
      </header>
    );
  }

  return (
    <header className="masthead">
      <div className="masthead__date">{dateStr}</div>
      <h1 className="masthead__title">Tin Radar</h1>
      <p className="masthead__subtitle">Bản đồ dư luận VN — Cập nhật mỗi giờ</p>
    </header>
  );
}

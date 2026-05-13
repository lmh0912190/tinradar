export function formatTraffic(traffic: number): string {
  if (traffic >= 1_000_000) return `${(traffic / 1_000_000).toFixed(1)}M+`;
  if (traffic >= 1_000) return `${Math.round(traffic / 1_000)}K+`;
  return `${traffic}+`;
}

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins}p trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  return `${diffDays}d trước`;
}

export function formatViDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const d = days[date.getDay()];
  return `${d}, ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

export function parseTrafficString(str: string): number {
  const s = str.trim().toUpperCase().replace('+', '');
  if (s.endsWith('M')) return parseFloat(s) * 1_000_000;
  if (s.endsWith('K')) return parseFloat(s) * 1_000;
  return parseInt(s, 10) || 0;
}

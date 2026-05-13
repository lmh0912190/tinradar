import { getSourceColor } from '@/lib/constants';

interface SourceBadgeProps {
  name: string;
}

export function SourceBadge({ name }: SourceBadgeProps) {
  const color = getSourceColor(name);
  return (
    <span
      className="source-badge"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {name}
    </span>
  );
}

interface SkeletonCardProps {
  delay?: number;
}

export function SkeletonCard({ delay = 0 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card" style={{ animationDelay: `${delay}s` }}>
      <div className="skeleton" style={{ width: 28, height: 22, flexShrink: 0 }} />
      <div className="skeleton" style={{ width: 3, height: 40, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '40%', height: 11 }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="skeleton" style={{ width: 48, height: 14, marginBottom: 4 }} />
        <div className="skeleton" style={{ width: 36, height: 10 }} />
      </div>
    </div>
  );
}

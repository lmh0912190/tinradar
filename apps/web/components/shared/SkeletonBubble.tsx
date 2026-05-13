interface SkeletonBubbleProps {
  size: number;
  delay?: number;
}

export function SkeletonBubble({ size, delay = 0 }: SkeletonBubbleProps) {
  return (
    <div
      className="skeleton-bubble skeleton"
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

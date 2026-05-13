interface StorySummaryProps {
  summary: string;
  accent: string;
}

export function StorySummary({ summary, accent }: StorySummaryProps) {
  return (
    <div className="story-summary" style={{ '--story-accent': accent } as React.CSSProperties}>
      <div className="story-summary__label">Tóm lược</div>
      <p className="story-summary__text">{summary}</p>
    </div>
  );
}

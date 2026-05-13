import type { StoryArticle } from '@trend-radar/shared';
import { timeAgo } from '@/lib/utils';
import { getSourceColor } from '@/lib/constants';

interface TimelineProps {
  articles: StoryArticle[];
  accent: string;
}

export function Timeline({ articles, accent }: TimelineProps) {
  const sorted = [...articles]
    .filter((a) => a.publishedAt)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 8);

  if (sorted.length === 0) return null;

  return (
    <div
      className="timeline-card"
      style={{ '--story-accent': accent } as React.CSSProperties}
    >
      <div className="timeline-card__title">Dòng thời gian</div>
      <div className="timeline">
        {sorted.map((article, i) => {
          const sourceColor = getSourceColor(article.sourceName);
          const isFirst = i === 0;

          return (
            <div key={article.id} className="timeline-item">
              <div className="timeline-item__dot-col">
                <div
                  className={`timeline-item__dot ${isFirst ? 'timeline-item__dot--first' : 'timeline-item__dot--rest'}`}
                  style={isFirst ? { background: accent } : {}}
                />
                {i < sorted.length - 1 && <div className="timeline-item__line" />}
              </div>
              <div className="timeline-item__content">
                <div className="timeline-item__time">{timeAgo(article.publishedAt)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span className="timeline-item__source" style={{ color: sourceColor }}>
                    {article.sourceName}
                  </span>
                </div>
                <a
                  href={article.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-item__title"
                >
                  {article.title}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

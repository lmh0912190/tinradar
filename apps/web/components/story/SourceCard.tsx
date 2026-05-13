'use client';

import { useState } from 'react';
import type { StoryArticle } from '@trend-radar/shared';
import { timeAgo } from '@/lib/utils';
import { SourceBadge } from '@/components/shared/SourceBadge';

interface SourceCardProps {
  article: StoryArticle;
  accent: string;
}

export function SourceCard({ article, accent }: SourceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`source-card${expanded ? ' source-card--expanded' : ''}`}
      style={{ '--story-accent': accent } as React.CSSProperties}
    >
      <div className="source-card__header" onClick={() => setExpanded((v) => !v)}>
        <div className="source-card__left">
          <SourceBadge name={article.sourceName} />
          <span className="source-card__title">{article.title}</span>
        </div>
        <span className="source-card__time">{timeAgo(article.publishedAt)}</span>
        <i className="source-card__chevron">▾</i>
      </div>
      {expanded && (
        <div className="source-card__body">
          {article.snippet && (
            <p className="source-card__snippet">{article.snippet}</p>
          )}
          <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-card__link"
          >
            Đọc bài gốc ↗
          </a>
        </div>
      )}
    </div>
  );
}

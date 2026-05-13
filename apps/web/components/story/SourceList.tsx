import type { StoryArticle } from '@trend-radar/shared';
import { SourceCard } from './SourceCard';

interface SourceListProps {
  articles: StoryArticle[];
  accent: string;
}

export function SourceList({ articles, accent }: SourceListProps) {
  return (
    <div className="source-list">
      <div className="source-list__title">Các nguồn tin</div>
      {articles.map((article) => (
        <SourceCard key={article.id} article={article} accent={accent} />
      ))}
    </div>
  );
}

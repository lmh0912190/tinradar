import type { StoryData } from '@trend-radar/shared';
import { formatTraffic, timeAgo } from '@/lib/utils';
import { CategoryBadge } from '@/components/shared/CategoryBadge';

interface StoryHeaderProps {
  story: StoryData;
  accent: string;
  bg: string;
}

export function StoryHeader({ story, accent, bg }: StoryHeaderProps) {
  const newestArticle = story.articles.reduce<string | null>((latest, a) => {
    if (!a.publishedAt) return latest;
    if (!latest) return a.publishedAt;
    return a.publishedAt > latest ? a.publishedAt : latest;
  }, null);

  return (
    <div
      className={`story-header${story.pictureUrl ? ' story-header--has-img' : ''}`}
      style={{ background: bg, '--story-accent': accent } as React.CSSProperties}
    >
      {story.pictureUrl && (
        <img className="story-header__hero-img" src={story.pictureUrl} alt={story.keyword} />
      )}
      <div className="story-header__body">
        <div className="story-header__meta">
          {story.category && <CategoryBadge name={story.category} />}
          <span className="story-header__time">{timeAgo(newestArticle)}</span>
          <span className="story-header__traffic">
            ● {formatTraffic(story.traffic)}
          </span>
        </div>
        <h1 className="story-header__title">{story.keyword}</h1>
        <p className="story-header__subtitle">
          Tổng hợp từ {story.sourceCount} nguồn tin · {story.articleCount} bài viết
        </p>
      </div>
    </div>
  );
}

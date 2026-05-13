import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStoryData } from '@/lib/api';
import { getCategoryByName } from '@/lib/constants';
import { Masthead } from '@/components/shared/Masthead';
import { Footer } from '@/components/shared/Footer';
import { StoryHeader } from '@/components/story/StoryHeader';
import { StorySummary } from '@/components/story/StorySummary';
import { SourceList } from '@/components/story/SourceList';
import { Timeline } from '@/components/story/Timeline';
import { BackButton } from '@/components/story/BackButton';
import { JsonLd } from '@/components/shared/JsonLd';

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { story } = await getStoryData(slug);
    const cat = getCategoryByName(story.category ?? '');
    return {
      title: `${story.keyword} — Tin Radar`,
      description: story.summary ?? `Xu hướng tìm kiếm: ${story.keyword}`,
      openGraph: {
        title: `${story.keyword} — Xu hướng tìm kiếm`,
        description: story.summary ?? '',
        type: 'article',
        section: story.category ?? '',
        url: `${process.env['NEXT_PUBLIC_SITE_URL']}/xu-huong/${story.slug}`,
      },
      alternates: {
        canonical: `${process.env['NEXT_PUBLIC_SITE_URL']}/xu-huong/${story.slug}`,
      },
    };
  } catch {
    return { title: 'Tin Radar' };
  }
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  let story;
  try {
    const data = await getStoryData(slug);
    story = data.story;
  } catch {
    notFound();
  }

  const cat = getCategoryByName(story.category ?? '');
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://trendradar.vn';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `${story.keyword} — Xu hướng tìm kiếm`,
    description: story.summary ?? '',
    datePublished: story.articles[0]?.publishedAt ?? story.updatedAt,
    dateModified: story.updatedAt,
    author: { '@type': 'Organization', name: 'Tin Radar' },
    publisher: { '@type': 'Organization', name: 'Tin Radar' },
    mainEntityOfPage: `${siteUrl}/xu-huong/${story.slug}`,
  };

  return (
    <main className="page-wrapper story-page page-enter">
      <JsonLd data={jsonLd} />
      <Masthead compact />
      <BackButton />
      <StoryHeader story={story} accent={cat.accent} bg={cat.bg} />
      {story.summary && <StorySummary summary={story.summary} accent={cat.accent} />}
      {story.articles.length > 0 && <SourceList articles={story.articles} accent={cat.accent} />}
      {story.articles.length > 1 && <Timeline articles={story.articles} accent={cat.accent} />}
      <Footer />
    </main>
  );
}

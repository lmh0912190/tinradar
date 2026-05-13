import type { Metadata } from 'next';
import { getRadarData } from '@/lib/api';
import { getCategoryBySlug, CATEGORIES } from '@/lib/constants';
import { Masthead } from '@/components/shared/Masthead';
import { Footer } from '@/components/shared/Footer';
import { StatsBar } from '@/components/radar/StatsBar';
import { RadarView } from '@/components/radar/RadarView';

export const revalidate = 300;

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  return {
    title: `${cat.name} — Tin Radar`,
    description: `Xu hướng tìm kiếm về ${cat.name} tại Việt Nam theo thời gian thực.`,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== 'tat-ca').map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  const data = await getRadarData({ category }).catch(() => null);

  return (
    <main className="page-wrapper page-enter">
      <Masthead />
      {data ? (
        <>
          <StatsBar stats={data.stats} />
          <RadarView initialData={data} defaultCategory={category} />
        </>
      ) : (
        <div className="error-state">⚠ Không thể tải dữ liệu.</div>
      )}
      <Footer />
    </main>
  );
}

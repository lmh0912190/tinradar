import { getRadarData } from '@/lib/api';
import { Masthead } from '@/components/shared/Masthead';
import { Footer } from '@/components/shared/Footer';
import { StatsBar } from '@/components/radar/StatsBar';
import { RadarView } from '@/components/radar/RadarView';

export const revalidate = 300;

export default async function HomePage() {
  const data = await getRadarData().catch(() => null);

  return (
    <main className="page-wrapper page-enter">
      <Masthead />
      {data ? (
        <>
          <StatsBar stats={data.stats} />
          <RadarView initialData={data} />
        </>
      ) : (
        <div className="error-state">⚠ Không thể tải dữ liệu. Thử lại sau.</div>
      )}
      <Footer />
    </main>
  );
}

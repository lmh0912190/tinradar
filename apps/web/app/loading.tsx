import { Masthead } from '@/components/shared/Masthead';
import { Footer } from '@/components/shared/Footer';
import { SkeletonBubble } from '@/components/shared/SkeletonBubble';
import { SkeletonCard } from '@/components/shared/SkeletonCard';

export default function HomeLoading() {
  return (
    <main className="page-wrapper">
      <Masthead />
      <div className="bubble-chart" style={{ minHeight: 240 }}>
        {[120, 160, 100, 140, 90, 130, 80].map((size, i) => (
          <SkeletonBubble key={i} size={size} delay={i * 0.1} />
        ))}
      </div>
      <div className="trend-list" style={{ marginTop: 28 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.07} />
        ))}
      </div>
      <Footer />
    </main>
  );
}

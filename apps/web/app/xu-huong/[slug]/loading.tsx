import { Masthead } from '@/components/shared/Masthead';

export default function StoryLoading() {
  return (
    <main className="page-wrapper story-page">
      <Masthead compact />
      <div style={{ paddingTop: 16 }}>
        <div className="skeleton" style={{ width: 80, height: 14, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: '100%', height: 80, borderRadius: 8, marginBottom: 24 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ width: '100%', height: 56, borderRadius: 8, marginBottom: 8 }} />
        ))}
      </div>
    </main>
  );
}

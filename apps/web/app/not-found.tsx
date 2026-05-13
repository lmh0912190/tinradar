import Link from 'next/link';
import { Masthead } from '@/components/shared/Masthead';
import { Footer } from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <main className="page-wrapper">
      <Masthead />
      <div className="empty-state" style={{ paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
        <p>Trang bạn tìm không tồn tại.</p>
        <Link href="/" style={{ marginTop: 16, display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: 13, textDecoration: 'underline', color: 'var(--text-muted)' }}>
          ← Về trang chủ
        </Link>
      </div>
      <Footer />
    </main>
  );
}

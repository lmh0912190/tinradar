'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page-wrapper" style={{ paddingTop: 40 }}>
      <div className="error-state">
        <span>⚠</span>
        <div>
          <div style={{ fontWeight: 600 }}>Đã xảy ra lỗi</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{error.message}</div>
          <button
            onClick={reset}
            style={{ marginTop: 8, textDecoration: 'underline', fontFamily: 'var(--font-ui)', fontSize: 12 }}
          >
            Thử lại
          </button>
        </div>
      </div>
    </main>
  );
}

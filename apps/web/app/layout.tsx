import type { Metadata } from 'next';
import { playfairDisplay, sourceSerif4, dmSans } from '@/styles/fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Tin Radar — Bản đồ dư luận Việt Nam',
  description: 'Xu hướng tìm kiếm tại Việt Nam theo thời gian thực. Tổng hợp và trực quan hóa trending topics từ nhiều nguồn tin.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://trendradar.vn'),
  openGraph: {
    siteName: 'Tin Radar',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfairDisplay.variable} ${sourceSerif4.variable} ${dmSans.variable}`}>
      <body style={{
        '--font-display': `var(${playfairDisplay.variable}), Georgia, serif`,
        '--font-body': `var(${sourceSerif4.variable}), Georgia, serif`,
        '--font-ui': `var(${dmSans.variable}), system-ui, sans-serif`,
      } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}

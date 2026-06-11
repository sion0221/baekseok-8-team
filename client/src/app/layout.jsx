import ClientLayout from '@/components/common/client-layout';
import { ThemeProvider } from '@/context/theme-context';
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: '킥보드 신고 서비스',
  description: '교내 불법 주정차 킥보드를 AI로 자동 감지하고 신고하는 서비스',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: '[BU] 킥보드 신고 서비스',
    description: '교내 불법 주정차 킥보드를 AI로 자동 감지하고 신고하는 서비스',
    url: 'https://baekseok-8.vercel.app',
    siteName: '킥보드 신고 서비스',
    images: [
      {
        url: 'https://baekseok-8.vercel.app/logo.svg',
        width: 400,
        height: 400,
        alt: '킥보드 신고 서비스 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 다크모드 깜빡임 방지 — 렌더 전에 class 적용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

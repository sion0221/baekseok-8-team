import ClientLayout from '@/components/common/client-layout';
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: '킥보드 신고 서비스',
  description: '교내 불법 주정차 킥보드 신고 서비스',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="afterInteractive"
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

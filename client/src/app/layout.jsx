import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
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
        <Header />
        <main className="flex-1 w-full max-w-[768px] pt-[56px] pb-[60px] mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

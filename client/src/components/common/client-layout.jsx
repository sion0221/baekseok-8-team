'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

const AUTH_PATHS = ['/sign-in', '/sign-up', '/find-id', '/reset-password', '/update-password'];

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return (
      <main className="flex-1 w-full max-w-[768px] mx-auto px-4">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[768px] pt-[56px] pb-[60px] mx-auto px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}

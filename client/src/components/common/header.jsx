'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { NAV_ITEMS, BACK_BUTTON_PATHS } from '@/constants';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSidebarOpen = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const isBackButtonPage =
    BACK_BUTTON_PATHS.includes(pathname) ||
    pathname.startsWith('/report-board/');

  if (isBackButtonPage) {
    return (
      <header className="fixed top-0 right-0 left-0 z-40 h-[56px] bg-white border-b border-gray-100">
        <div className="flex items-center w-full max-w-[768px] h-full mx-auto px-4">
          <Link href={pathname.startsWith('/report-board/') ? '/report-board' : '/'} aria-label="뒤로가기">
            <ChevronLeft size={24} className="text-gray-700" />
          </Link>
          <span className="ml-2 text-[16px] font-medium text-gray-900">
            {pathname === '/report' && '신고하기'}
            {pathname === '/map' && '전체 신고 지도'}
            {pathname.startsWith('/report-board/') && '신고 상세'}
          </span>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 h-[56px] bg-white border-b border-gray-100">
        <div className="flex items-center justify-between w-full max-w-[768px] h-full mx-auto px-4">
          <button
            onClick={handleSidebarOpen}
            className="p-1 text-gray-700"
            aria-label="메뉴 열기"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/logo.svg" alt="로고" width={40} height={40} />
          </Link>

          <Link
            href="/mypage"
            className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-gray-100"
            aria-label="프로필"
          >
            <span className="text-[13px] text-gray-400">👤</span>
          </Link>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={handleSidebarClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-[260px] h-full bg-white transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-[56px] px-5 border-b border-gray-100">
          <span className="text-[15px] font-semibold text-gray-900">메뉴</span>
          <button
            onClick={handleSidebarClose}
            className="text-gray-400"
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleSidebarClose}
              className={`px-4 py-3 rounded-[8px] text-[14px] transition-colors ${
                pathname === item.href
                  ? 'bg-[#5A66EB]/10 text-[#5A66EB] font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
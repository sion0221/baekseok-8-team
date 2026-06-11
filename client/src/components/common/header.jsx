'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { NAV_ITEMS, BACK_BUTTON_PATHS } from '@/constants';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('profile_url_cache') || null : null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('users')
        .select('profile_url')
        .eq('id', session.user.id)
        .single();
      if (data?.profile_url) {
        setProfileUrl(data.profile_url);
        localStorage.setItem('profile_url_cache', data.profile_url);
      }
    };
    fetchProfile();

    const handleProfileUpdated = (e) => setProfileUrl(e.detail.profileUrl);
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('username_cache');
    localStorage.removeItem('profile_url_cache');
    handleSidebarClose();
    router.replace('/sign-in');
  };
  const pathname = usePathname();

  const handleSidebarOpen = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const isBackButtonPage =
    BACK_BUTTON_PATHS.includes(pathname) ||
    pathname.startsWith('/report-board/');

  if (isBackButtonPage) {
    return (
      <header className="fixed top-0 right-0 left-0 z-40 h-[56px] bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center w-full max-w-[768px] h-full mx-auto px-4">
          <Link href={pathname.startsWith('/report-board/') ? '/report-board' : pathname.startsWith('/mypage/') ? '/mypage' : '/'} aria-label="뒤로가기" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[8px] transition-colors">
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </Link>
          <span className="ml-2 text-[16px] font-medium text-gray-900 dark:text-gray-100">
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
      <header className="fixed top-0 right-0 left-0 z-40 h-[56px] bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between w-full max-w-[768px] h-full mx-auto px-4">
          <button
            onClick={handleSidebarOpen}
            className="p-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[8px] transition-colors cursor-pointer"
            aria-label="메뉴 열기"
          >
            <Menu size={22} />
          </button>

          <Link href="/main" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/logo.svg" alt="로고" width={40} height={40} loading="eager" />
          </Link>

          <Link
            href="/mypage"
            className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="프로필"
          >
            {profileUrl ? (
              <img src={profileUrl} alt="프로필" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-[13px] text-gray-400">👤</span>
            )}
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
        className={`fixed top-0 left-0 z-50 w-[260px] h-full bg-white dark:bg-gray-800 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-[56px] px-5 border-b border-gray-100 dark:border-gray-700">
          <span className="text-[15px] font-semibold text-gray-900 dark:text-white">메뉴</span>
          <button
            onClick={handleSidebarClose}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-[8px] transition-colors cursor-pointer"
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
                  : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-[8px] text-[14px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
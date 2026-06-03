'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/constants';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 right-0 left-0 z-40 h-[60px] bg-white border-t border-gray-100">
      <nav className="flex items-center justify-around w-full max-w-[768px] h-full mx-auto px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col flex-1 items-center gap-[3px] py-2"
            >
              <Icon
                size={22}
                className={isActive ? 'text-[#5A66EB]' : 'text-gray-400'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[11px] ${
                  isActive ? 'text-[#5A66EB] font-medium' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

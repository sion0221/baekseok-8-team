'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ReportBanner() {
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username_cache') || null;
    }
    return null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', user.id)
        .single();

      if (data?.nickname) {
        setUsername(data.nickname);
        localStorage.setItem('username_cache', data.nickname);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-[#5A66EB] px-5 py-6 mb-4">
      <div className="relative z-10">
        <p className="text-[15px] font-medium text-white/90 mb-1">
          {username
            ? `안녕하세요, ${username}님`
            : <span className="inline-block w-20 h-4 bg-white/20 rounded animate-pulse" />
          }
        </p>
        <p className="text-[20px] font-bold text-white leading-tight mb-1">
          불법 킥보드 발견했나요?
        </p>
        <p className="text-[20px] font-bold text-white leading-tight mb-5">
          바로 <span className="text-yellow-300">신고</span>하세요
        </p>
        <Link
          href="/report"
          className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-[14px] font-medium px-4 py-3 rounded-[12px]"
        >
          <span className="text-[18px]">＋</span>
          <div>
            <p className="text-[14px] font-medium">신고하기</p>
            <p className="text-[11px] text-white/60">GPS 자동 위치 감지</p>
          </div>
        </Link>
      </div>
      <div className="absolute right-0 -bottom-4 text-[230px] select-none pointer-events-none"
           style={{ opacity: 0.5, lineHeight: 1 }}>
        🛴
      </div>
    </div>
  );
}

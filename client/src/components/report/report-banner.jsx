'use client';

import Link from 'next/link';
import { MOCK_USER } from '@/mocks';

export default function ReportBanner({ username = '사용자' }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] bg-[#5A66EB] px-5 py-6 mb-4">
      <div className="relative z-10">
        <p className="text-[13px] text-indigo-200 mb-1">
          안녕하세요, {MOCK_USER.nickname}님
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
            <p className="text-[11px] text-indigo-200">GPS 자동 위치 감지</p>
          </div>
        </Link>
      </div>
      <div className="absolute right-4 top-4 opacity-20 text-[80px] select-none">
        🛴
      </div>
    </div>
  );
}

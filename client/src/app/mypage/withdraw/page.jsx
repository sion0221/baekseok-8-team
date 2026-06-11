'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WithdrawPage() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!isChecked) return;
    if (!window.confirm('탈퇴 시 모든 데이터가 삭제됩니다. 정말 탈퇴하시겠습니까?')) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('로그인이 필요합니다.');

      const res = await fetch('/api/withdraw', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '탈퇴 처리에 실패했습니다.');

      await supabase.auth.signOut();
      localStorage.removeItem('username_cache');
      localStorage.removeItem('profile_url_cache');

      alert('탈퇴 처리가 완료되었습니다.');
      router.replace('/sign-in');
    } catch (err) {
      alert('탈퇴 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 flex flex-col gap-3">
      <div className="bg-red-50 dark:bg-red-900/20 border-[0.5px] border-red-100 dark:border-red-800/30 rounded-[12px] p-4 flex flex-col items-center text-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
          정말 탈퇴하시겠습니까?
        </p>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          탈퇴하시면 모든 신고 내역과 등급이{' '}
          <span className="font-semibold text-red-500">영구적으로 삭제</span>
          되며, 다시 복구할 수 없습니다.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-3">
          탈퇴 전 확인해주세요
        </p>
        <dl className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {[
            '진행 중인 신고 건은 탈퇴 즉시 취소 처리됩니다.',
            '개인정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.',
            '동일한 이메일로 30일 동안 재가입이 불가능합니다.',
          ].map((text, i) => (
            <div key={i} className="py-2.5">
              <p className="text-[13px] text-gray-600">{text}</p>
            </div>
          ))}
        </dl>
      </div>

      <label className="flex items-center gap-3 px-1 cursor-pointer">
        <div className="relative flex items-center justify-center flex-shrink-0">
          <input
            type="checkbox"
            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[4px] checked:bg-red-500 checked:border-red-500 transition-colors cursor-pointer"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <svg
            className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-[13px] text-gray-600">
          위 안내사항을 모두 확인하였으며, 이에 동의합니다.
        </span>
      </label>

      <button
        onClick={handleWithdraw}
        disabled={!isChecked || isLoading}
        className={`w-full h-[48px] rounded-[12px] text-[15px] font-medium transition-colors ${
          isChecked && !isLoading
            ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? '처리 중...' : '회원 탈퇴하기'}
      </button>
    </div>
  );
}

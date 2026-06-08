'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertCircle } from 'lucide-react';

const WithdrawPage = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleWithdraw = () => {
    if (!isChecked) {
      alert('안내사항을 확인하고 동의해주세요.');
      return;
    }
    if (
      window.confirm('탈퇴 시 모든 데이터가 삭제됩니다. 정말 탈퇴하시겠습니까?')
    ) {
      alert('탈퇴 처리가 완료되었습니다.');
      router.push('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <div className="bg-white flex items-center p-4 shadow-sm relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900">
          회원탈퇴
        </h1>
      </div>

      <div className="p-5 space-y-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            정말 탈퇴하시겠습니까?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            탈퇴하시면 현재까지의{' '}
            <span className="font-bold text-red-500">
              모든 신고 내역과 활동 포인트가 영구적으로 삭제
            </span>
            되며, 다시 복구할 수 없습니다.
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <h3 className="font-bold text-gray-800 mb-4">탈퇴 전 확인해주세요</h3>
          <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside">
            <li>진행 중인 신고 건은 탈퇴 즉시 취소 처리됩니다.</li>
            <li>개인정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.</li>
            <li>동일한 이메일로 30일 동안 재가입이 불가능합니다.</li>
          </ul>
        </div>

        <label className="flex items-center gap-3 p-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-red-500 checked:border-red-500 transition-colors cursor-pointer"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <svg
              className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
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
          <span className="text-sm font-medium text-gray-800 group-hover:text-red-500 transition-colors">
            위 안내사항을 모두 확인하였으며, 이에 동의합니다.
          </span>
        </label>

        <button
          onClick={handleWithdraw}
          className={`w-full py-4 rounded-xl font-bold transition-colors ${
            isChecked
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          회원 탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;

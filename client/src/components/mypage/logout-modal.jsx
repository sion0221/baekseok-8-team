'use client';

import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-[16px] p-6 w-full max-w-[320px]">
        <p className="text-[16px] font-semibold text-gray-900 dark:text-gray-100 mb-1">로그아웃</p>
        <p className="text-[13px] text-gray-400 mb-6">정말 로그아웃 하시겠습니까?</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[12px] border-[0.5px] border-gray-200 dark:border-gray-600 text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[48px] rounded-[12px] bg-[#5A66EB] text-[14px] font-medium text-white hover:bg-[#4A56DB] transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

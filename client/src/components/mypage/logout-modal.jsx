'use client';

import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">로그아웃</h3>
        <p className="text-sm text-gray-600 mb-6">
          정말 로그아웃 하시겠습니까?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#5A66EB] text-white font-medium hover:bg-[#4853cc] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

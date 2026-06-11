'use client';

import React, { useState } from 'react';

const EditForm = ({ initialData, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedData = {
      name: e.target.nickname.value,
    };
    try {
      await onSave(updatedData);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
      <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">회원정보 수정</p>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[#1E293B]">사용자 이름</label>
          <input
            name="nickname"
            defaultValue={initialData?.name || ''}
            className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[#1E293B]">이메일</label>
          <input
            value={initialData?.email || ''}
            disabled
            className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[#1E293B]">현재 비밀번호</label>
          <input
            type="password"
            placeholder="현재 비밀번호 입력"
            className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[#1E293B]">새 비밀번호</label>
          <input
            type="password"
            placeholder="새 비밀번호 입력 (변경 시에만)"
            className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-[48px] rounded-[12px] border-[0.5px] border-gray-200 dark:border-gray-600 text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-[48px] rounded-[12px] bg-[#5A66EB] text-[14px] font-medium text-white hover:bg-[#4A56DB] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;

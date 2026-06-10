'use client';

import React, { useState } from 'react';

const EditForm = ({ initialData, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPasswordChanged, setHasPasswordChanged] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailId = e.target.emailId.value;
    const emailDomain = e.target.emailDomain.value;

    const updatedData = {
      name: e.target.nickname.value,
      email: `${emailId}@${emailDomain}`,
    };

    try {
      await onSave(updatedData);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const initialEmail = initialData?.email || 'user@example.com';
  const emailParts = initialEmail.split('@');
  const initialId = emailParts[0] || '';
  const initialDomain = emailParts.length > 1 ? emailParts[1] : '';

  return (
    <div className="bg-white p-6 rounded-2xl w-full mx-auto border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">회원정보 수정</h2>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사용자 이름
          </label>
          <input
            name="nickname"
            defaultValue={initialData?.name || '사용자'}
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-[#5A66EB] focus:ring-1 focus:ring-[#5A66EB] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <div className="flex items-center gap-2">
            <input
              name="emailId"
              type="text"
              defaultValue={initialId}
              className="flex-1 min-w-0 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-[#5A66EB] focus:ring-1 focus:ring-[#5A66EB] transition-all"
            />
            <span className="text-gray-400 font-medium">@</span>
            <input
              name="emailDomain"
              type="text"
              defaultValue={initialDomain}
              className="flex-1 min-w-0 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-[#5A66EB] focus:ring-1 focus:ring-[#5A66EB] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 비밀번호
          </label>
          <input
            type="password"
            placeholder="********"
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-[#5A66EB] focus:ring-1 focus:ring-[#5A66EB] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-[#5A66EB] focus:ring-1 focus:ring-[#5A66EB] transition-all"
            onChange={(e) => setHasPasswordChanged(e.target.value.length > 0)}
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#F8F9FA] text-gray-600 border border-gray-200 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#5A66EB] text-white py-3.5 rounded-xl font-medium hover:bg-[#4853cc] transition-colors disabled:bg-gray-300"
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;

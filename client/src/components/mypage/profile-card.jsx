'use client';

import React from 'react';

const ProfileCard = ({ userInfo, onToggleEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-[52px] h-[52px] bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-[26px] text-gray-400">👤</span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{userInfo?.name}</p>
            <p className="text-[12px] text-gray-400">{userInfo?.email}</p>
          </div>
        </div>
        <button
          onClick={onToggleEdit}
          className="text-[12px] font-medium px-3 py-1.5 rounded-[8px] border-[0.5px] border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-[#5A66EB] hover:text-[#5A66EB] dark:hover:border-[#5A66EB] dark:hover:text-[#5A66EB] transition-colors cursor-pointer"
        >
          정보 수정
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-gray-50 dark:bg-gray-700 border-[0.5px] border-gray-100 dark:border-gray-600 rounded-[12px] p-3 flex flex-col items-center gap-1">
          <span className="text-[15px] font-bold text-[#5A66EB]">{userInfo?.grade}</span>
          <span className="text-[11px] text-gray-400">현재 등급</span>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-700 border-[0.5px] border-gray-100 dark:border-gray-600 rounded-[12px] p-3 flex flex-col items-center gap-1">
          <span className="text-[15px] font-bold text-[#5A66EB]">{userInfo?.reportCount}</span>
          <span className="text-[11px] text-gray-400">총 신고 횟수</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

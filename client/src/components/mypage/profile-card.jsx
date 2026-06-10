'use client';

import React from 'react';

const ProfileCard = ({ userInfo, onToggleEdit }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-[26px] text-gray-400 select-none">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {userInfo?.name}
            </h2>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
        <button
          onClick={onToggleEdit}
          className="text-xs font-medium px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:text-[#5A66EB] hover:border-[#5A66EB] transition-colors"
        >
          정보 수정
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-[#F8F9FA] rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
          <span className="text-lg font-bold text-[#5A66EB] mb-1">
            {userInfo?.grade}
          </span>
          <span className="text-xs text-gray-500 font-medium">현재 등급</span>
        </div>
        <div className="flex-1 bg-[#F8F9FA] rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
          <span className="text-lg font-bold text-[#5A66EB] mb-1">
            {userInfo?.reportCount}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            총 신고 횟수
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

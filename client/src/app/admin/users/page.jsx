'use client';

import React, { useState } from 'react';
import Header from '@/components/common/header';

const UserListPage = () => {
  const [activeTab, setActiveTab] = useState('전체');

  const users = [
    {
      id: 1,
      name: 'kim',
      reason: '오보신고 3회',
      status: '경고',
      btnStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    {
      id: 2,
      name: 'lee',
      reason: '오보신고 5회',
      status: '정지',
      btnStyle: 'bg-[#EF4444] text-white hover:bg-red-600',
    },
    {
      id: 3,
      name: 'park',
      reason: '오보신고 1회',
      status: '정상',
      btnStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    {
      id: 4,
      name: 'choi',
      reason: '오보신고 0회',
      status: '정상',
      btnStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
  ];

  const filteredUsers = users.filter((user) => {
    if (activeTab === '전체') return true;
    if (activeTab === '정지') return user.status === '정지';
    if (activeTab === '경고') return user.status === '경고';
    return true;
  });

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <div className="bg-white pb-4 shadow-sm">
        <Header />
        <div className="px-5 mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">이용자 관리</h2>

          <ul className="flex gap-2 overflow-x-auto hide-scrollbar">
            {['전체', '경고', '정지'].map((tab) => (
              <li key={tab} className="shrink-0">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    activeTab === tab
                      ? 'bg-[#5A66EB] text-white border-[#5A66EB]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-5">
        <ul className="space-y-3">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {user.name}
                </div>
                <div
                  className={`text-xs ${user.status === '정지' ? 'text-red-500 font-medium' : 'text-gray-500'}`}
                >
                  {user.reason}
                </div>
              </div>
              <button
                className={`text-xs px-4 py-1.5 rounded-md font-semibold transition-colors ${user.btnStyle}`}
              >
                {user.status === '정상' ? '경고' : user.status}
              </button>
            </li>
          ))}
        </ul>

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            해당 상태의 이용자가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;

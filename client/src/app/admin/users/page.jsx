'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/header';
import { supabase } from '@/lib/supabase';

const UserListPage = () => {
  const [activeTab, setActiveTab] = useState('전체');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setUsers(data);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUserStatus = (user) => {
    if (user.is_suspended) return '정지';
    if (user.warning_count > 0) return '경고';
    return '정상';
  };

  const getBtnStyle = (status) => {
    if (status === '정지') return 'bg-[#EF4444] text-white hover:bg-red-600';
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  const filteredUsers = users.filter((user) => {
    const status = getUserStatus(user);
    if (activeTab === '전체') return true;
    if (activeTab === '정지') return status === '정지';
    if (activeTab === '경고') return status === '경고';
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
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {filteredUsers.map((user) => {
                const currentStatus = getUserStatus(user);
                return (
                  <li
                    key={user.id}
                    className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {user.nickname}
                      </div>
                      <div
                        className={`text-xs ${currentStatus === '정지' ? 'text-red-500 font-medium' : 'text-gray-500'}`}
                      >
                        경고 {user.warning_count}회
                      </div>
                    </div>
                    <button
                      className={`text-xs px-4 py-1.5 rounded-md font-semibold transition-colors ${getBtnStyle(currentStatus)}`}
                    >
                      {currentStatus === '정상' ? '경고' : currentStatus}
                    </button>
                  </li>
                );
              })}
            </ul>

            {filteredUsers.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">
                해당 상태의 이용자가 없습니다.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserListPage;

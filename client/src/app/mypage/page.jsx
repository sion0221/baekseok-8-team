'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Bell, LogOut, UserMinus } from 'lucide-react';
import Header from '@/components/common/header';
import ProfileCard from '@/components/mypage/profile-card';
import EditForm from '@/components/mypage/edit-form';
import LogoutModal from '@/components/mypage/logout-modal';

const MyPage = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userInfo = {
    name: '사용자',
    email: 'user@example.com',
    grade: '실버',
    reportCount: '12',
  };

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSaveProfile = (newData) => {
    setIsEditMode(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20 relative">
      <Header />

      <div className="p-5">
        {isEditMode ? (
          <EditForm
            initialData={userInfo}
            onSave={handleSaveProfile}
            onCancel={handleToggleEdit}
          />
        ) : (
          <>
            <ProfileCard userInfo={userInfo} onToggleEdit={handleToggleEdit} />

            <ul className="mt-6 space-y-3">
              <li>
                <button
                  onClick={() => router.push('/mypage/notifications')}
                  className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between hover:border-[#5A66EB] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EDF0FE] flex items-center justify-center text-[#5A66EB]">
                      <Bell size={16} />
                    </div>
                    <span className="font-medium text-gray-800">알림 설정</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#5A66EB]" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between hover:border-[#5A66EB] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EDF0FE] flex items-center justify-center text-[#5A66EB]">
                      <LogOut size={16} />
                    </div>
                    <span className="font-medium text-gray-800">로그아웃</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#5A66EB]" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => router.push('/mypage/withdraw')}
                  className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between hover:border-[#5A66EB] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <UserMinus size={16} />
                    </div>
                    <span className="font-medium text-gray-800">회원탈퇴</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#5A66EB]" />
                </button>
              </li>
            </ul>
          </>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default MyPage;

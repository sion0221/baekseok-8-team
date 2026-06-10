'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Bell, LogOut, UserMinus } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import ProfileCard from '@/components/mypage/profile-card';
import EditForm from '@/components/mypage/edit-form';
import LogoutModal from '@/components/mypage/logout-modal';
import { supabase } from '@/lib/supabase';

const MyPage = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .single();

        if (userError) throw userError;

        const { count, error: countError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userData.id);

        if (countError) throw countError;

        setUserInfo({
          name: userData.nickname || '사용자',
          email: userData.email || '',
          grade: userData.grade || '브론즈',
          reportCount: count || 0,
        });
      } catch (error) {
        console.error('내 정보를 불러오는데 실패했습니다:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

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

  if (isLoading) return null;

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen relative pt-[56px] pb-20">
      <Header />

      <div className="max-w-[768px] mx-auto px-5 py-5">
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

      <Footer />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default MyPage;

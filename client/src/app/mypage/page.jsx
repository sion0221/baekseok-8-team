'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Bell,
  LogOut,
  UserMinus,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import ProfileCard from '@/components/mypage/profile-card';
import EditForm from '@/components/mypage/edit-form';
import LogoutModal from '@/components/mypage/logout-modal';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/theme-context';

const THEME_OPTIONS = [
  { value: 'light', label: '라이트', icon: Sun },
  { value: 'dark', label: '다크', icon: Moon },
  { value: 'system', label: '시스템', icon: Monitor },
];

export default function MyPage() {
  const router = useRouter();
  const { theme, changeTheme } = useTheme();
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
    <div className="py-4 flex flex-col gap-3">
      {isEditMode ? (
        <EditForm
          initialData={userInfo}
          onSave={handleSaveProfile}
          onCancel={handleToggleEdit}
        />
      ) : (
        <>
          <ProfileCard userInfo={userInfo} onToggleEdit={handleToggleEdit} />

          {/* 테마 설정 */}
          <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-3">
              테마
            </p>
            <div className="flex gap-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => changeTheme(value)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[10px] border-[0.5px] transition-colors cursor-pointer ${
                      active
                        ? 'border-[#5A66EB] bg-[#5A66EB]/10 text-[#5A66EB]'
                        : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[12px] font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 메뉴 */}
          <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] overflow-hidden">
            {[
              {
                label: '알림 설정',
                icon: <Bell size={16} />,
                iconBg: 'bg-[#5A66EB]/10 text-[#5A66EB]',
                onClick: () => router.push('/mypage/notifications'),
              },
              {
                label: '로그아웃',
                icon: <LogOut size={16} />,
                iconBg: 'bg-[#5A66EB]/10 text-[#5A66EB]',
                onClick: () => setIsLogoutModalOpen(true),
              },
              {
                label: '회원탈퇴',
                icon: <UserMinus size={16} />,
                iconBg: 'bg-red-50 text-red-500',
                onClick: () => router.push('/mypage/withdraw'),
                danger: true,
              },
            ].map(({ label, icon, iconBg, onClick, danger }, i, arr) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${i < arr.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
                  >
                    {icon}
                  </div>
                  <span
                    className={`text-[14px] font-medium ${danger ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
                  >
                    {label}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </>
      )}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}

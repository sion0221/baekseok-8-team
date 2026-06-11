'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { LucidePlus, LucideUser } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const EditForm = ({ initialData, onSave, onCancel }) => {
  const [nickname, setNickname] = useState(initialData?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePreview, setProfilePreview] = useState(initialData?.profileUrl || null);
  const [profileFile, setProfileFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError('PNG 또는 JPG, JPEG 이미지만 가능합니다.');
      e.target.value = '';
      return;
    }
    setImageError('');
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('로그인이 필요합니다.');

      const userId = session.user.id;
      let profileUrl = initialData?.profileUrl || null;

      // 프로필 이미지 업로드
      if (profileFile) {
        const ext = profileFile.name.split('.').pop();
        const path = `${userId}/profile.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('profile')
          .upload(path, profileFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('profile')
          .getPublicUrl(path);
        profileUrl = urlData.publicUrl;
      }

      // 닉네임 + 프로필 URL 업데이트
      const updates = { nickname, profile_url: profileUrl };
      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
      if (updateError) throw updateError;

      // 헤더 프로필 캐시 업데이트 + 이벤트 발송
      if (profileUrl) {
        localStorage.setItem('profile_url_cache', profileUrl);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { profileUrl } }));
      }

      // 비밀번호 변경
      if (newPassword) {
        if (!currentPassword) {
          setError('현재 비밀번호를 입력해주세요.');
          setIsSubmitting(false);
          return;
        }
        // 현재 비밀번호로 재인증
        const { error: reAuthError } = await supabase.auth.signInWithPassword({
          email: initialData?.email,
          password: currentPassword,
        });
        if (reAuthError) {
          setError('현재 비밀번호가 올바르지 않습니다.');
          setIsSubmitting(false);
          return;
        }
        // 새 비밀번호로 변경
        const { error: pwError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (pwError) throw pwError;
      }

      alert('프로필이 성공적으로 저장되었습니다.');
      onSave({ name: nickname, profileUrl });
    } catch (err) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
      <p className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">회원정보 수정</p>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">

        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleImageChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-[100px] h-[100px] cursor-pointer group"
          >
            <div className="flex items-center justify-center w-full h-full bg-[#D1D5DB] rounded-full overflow-hidden">
              {profilePreview ? (
                <Image
                  src={profilePreview}
                  alt="프로필 미리보기"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <LucideUser className="w-[48px] h-[48px] text-[#94A3B8]" />
              )}
            </div>
            <button
              type="button"
              className="absolute right-0 bottom-0 flex justify-center items-center w-[32px] h-[32px] bg-[#5A66EB] border-[2px] border-white rounded-full hover:bg-[#4852D4] transition-colors"
            >
              <LucidePlus className="text-white" size={16} />
            </button>
          </div>
          {imageError && (
            <p className="text-[12px] text-red-500 mt-1 text-center">{imageError}</p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-600 dark:text-gray-300">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-[48px] px-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB] border-none"
          />
        </div>

        {/* 이메일 (읽기 전용) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-600 dark:text-gray-300">이메일</label>
          <input
            value={initialData?.email || ''}
            disabled
            className="w-full h-[48px] px-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-[12px] text-[15px] outline-none opacity-60 cursor-not-allowed border-none"
          />
        </div>

        {/* 현재 비밀번호 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-600 dark:text-gray-300">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="비밀번호 변경 시 입력"
            className="w-full h-[48px] px-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB] border-none"
          />
        </div>

        {/* 새 비밀번호 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-600 dark:text-gray-300">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="변경할 비밀번호 입력"
            className="w-full h-[48px] px-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB] border-none"
          />
        </div>

        {error && (
          <p className="text-[13px] text-red-500 text-center">{error}</p>
        )}

        <div className="flex gap-2 mt-1">
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

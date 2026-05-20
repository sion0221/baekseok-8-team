"use client";

import React, { useState } from 'react';
import ProfileCard from '@/components/mypage/profile-card';
import EditForm from '@/components/mypage/edit-form';

// [규칙] 함수형 컴포넌트: PascalCase
const MyPage = () => {
  // [규칙] Boolean 변수: isEditMode
  const [isEditMode, setIsEditMode] = useState(false);

  // [규칙] 부모 내부 이벤트 핸들러: handleToggleEdit
  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  // [규칙] 부모 내부 이벤트 핸들러: handleSaveProfile
  const handleSaveProfile = (newData) => {
    console.log('저장됨:', newData);
    setIsEditMode(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">마이페이지</h1>
      {isEditMode ? (
        // [규칙] 자식에게 주는 props: onSave, onCancel
        <EditForm onSave={handleSaveProfile} onCancel={handleToggleEdit} />
      ) : (
        // [규칙] 자식에게 주는 props: onToggleEdit
        <ProfileCard userInfo={{ name: '김시민', email: 'citizen@email.com' }} onToggleEdit={handleToggleEdit} />
      )}
    </div>
  );
};

export default MyPage;
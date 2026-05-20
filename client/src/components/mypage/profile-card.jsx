"use client";
import React from 'react';
import { Button } from '@/components/ui/button'; // PascalCase로 import
import { Card } from '@/components/ui/card';

// [규칙] 함수형 컴포넌트: PascalCase
// [규칙] 자식 props: onToggleEdit
const ProfileCard = ({ userInfo, onToggleEdit }) => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold">{userInfo.name}님</h2>
      <p>{userInfo.email}</p>
      <Button onClick={onToggleEdit}>정보 수정</Button>
    </Card>
  );
};

export default ProfileCard;
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// [규칙] 함수형 컴포넌트: PascalCase
// [규칙] 자식 props: onSave, onCancel
const EditForm = ({ initialData, onSave, onCancel }) => {
  // [규칙] Boolean 변수: is- / has-
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPasswordChanged, setHasPasswordChanged] = useState(false);

  // [규칙] 부모(폼 자체) 내부 이벤트 처리 함수: handleXxx
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 임시 데이터. 실제로는 입력된 state 값을 모아서 전달해야 합니다.
    const updatedData = {
      nickname: '김시민', 
      email: 'citizen@email.com'
    };
    
    // 부모 컴포넌트(MyPage)로 데이터 전달
    onSave(updatedData); 
  };

  return (
    <div className="bg-[#2D2D2D] text-white p-6 rounded-2xl max-w-sm w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">회원정보 수정</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <Label className="text-gray-300">닉네임</Label>
          <Input defaultValue={initialData?.nickname || "김시민"} className="bg-transparent border-gray-600 text-white mt-1" />
        </div>
        
        <div>
          <Label className="text-gray-300">이메일</Label>
          <Input defaultValue={initialData?.email || "citizen@email.com"} readOnly className="bg-transparent border-gray-600 text-gray-400 mt-1 cursor-not-allowed" />
        </div>

        <div>
          <Label className="text-gray-300">현재 비밀번호</Label>
          <Input type="password" placeholder="********" className="bg-transparent border-gray-600 text-white mt-1" />
        </div>

        <div>
          <Label className="text-gray-300">새 비밀번호</Label>
          <Input 
            type="password" 
            placeholder="입력" 
            className="bg-transparent border-gray-600 text-white mt-1" 
            onChange={(e) => setHasPasswordChanged(e.target.value.length > 0)}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-[#5C45F2] hover:bg-indigo-600 mt-6 h-12 text-lg rounded-xl"
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
      </form>
    </div>
  );
};

export default EditForm;
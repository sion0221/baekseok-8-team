"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

// [규칙] 함수형 컴포넌트: PascalCase
// [규칙] 자식 props: onClose, onSubmit
const RejectModal = ({ reportId, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-bold">반려 사유 선택 (ID: {reportId})</h3>
        
        {/* 셀렉트박스 등 폼 내용 생략 */}

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose} variant="outline">취소</Button>
          <Button onClick={onSubmit} variant="destructive">반려 완료</Button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
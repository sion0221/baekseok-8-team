"use client";
import React, { useState } from 'react';
import RejectModal from '@/components/admin/reject-modal';
// ReportTable 임포트 생략

// [규칙] 함수형 컴포넌트: PascalCase
const AdminPage = () => {
  // [규칙] Boolean 변수: isRejectModalOpen, hasSelectedReport
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const hasSelectedReport = selectedReportId !== null;

  // [규칙] 부모 내부 핸들러: handleOpenRejectModal
  const handleOpenRejectModal = (id) => {
    setSelectedReportId(id);
    setIsRejectModalOpen(true);
  };

  // [규칙] 부모 내부 핸들러: handleCloseRejectModal
  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedReportId(null);
  };

  // [규칙] 부모 내부 핸들러: handleRejectSubmit
  const handleRejectSubmit = () => {
    console.log(`${selectedReportId} 반려 처리됨`);
    setIsRejectModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      
      {/* 테이블 내부 버튼 클릭 시 handleOpenRejectModal(row.id) 호출하도록 
        onOpenReject props로 전달 
      */}
      {/* <ReportTable onOpenReject={handleOpenRejectModal} /> */}

      {isRejectModalOpen && hasSelectedReport && (
        <RejectModal 
          reportId={selectedReportId}
          onClose={handleCloseRejectModal} 
          onSubmit={handleRejectSubmit} 
        />
      )}
    </div>
  );
};

export default AdminPage;
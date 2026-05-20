"use client";
import React from 'react';

// [규칙] 함수형 컴포넌트: PascalCase
// [규칙] 자식 props: onComplete, onOpenReject
const ReportTable = ({ reports, onComplete, onOpenReject }) => {
  // [규칙] Boolean 변수: has-
  const hasReports = reports && reports.length > 0;

  if (!hasReports) {
    return <div className="p-4 text-center text-gray-500">현재 접수된 신고가 없습니다.</div>;
  }

  return (
    <div className="bg-gray-100 rounded-2xl p-4">
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-1 bg-gray-300 rounded-full text-sm">전체</button>
        <button className="px-4 py-1 bg-gray-300 rounded-full text-sm">미처리</button>
        <button className="px-4 py-1 bg-gray-300 rounded-full text-sm">처리중</button>
      </div>

      <div className="space-y-2">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex-1">
              <p className="font-bold text-sm">{report.location}</p>
              <p className="text-xs text-gray-500 mt-1">{report.type} · {report.time}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 상태 뱃지 (접수됨, 처리중 등) */}
              <span className={`text-xs px-2 py-1 rounded-full ${
                report.status === '접수됨' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {report.status}
              </span>
              
              {/* [규칙] 부모(AdminPage)에서 내려준 이벤트를 실행 */}
              <button 
                onClick={() => onComplete(report.id)} 
                className="text-xs bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300"
              >
                완료
              </button>
              <button 
                onClick={() => onOpenReject(report.id)} 
                className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                반려
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTable;
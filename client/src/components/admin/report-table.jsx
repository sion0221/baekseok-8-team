'use client';

import React, { useState } from 'react';

const ReportTable = ({ reports = [] }) => {
  const [activeTab, setActiveTab] = useState('전체');

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const filteredReports = reports.filter((report) => {
    const currentStatus = report.status || '접수됨';
    if (activeTab === '전체') return true;
    if (activeTab === '미처리')
      return currentStatus === '접수됨' || currentStatus === '반려됨';
    if (activeTab === '처리중') return currentStatus === '처리중';
    if (activeTab === '처리 완료') return currentStatus === '처리 완료';
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case '접수됨':
        return 'bg-[#EDF0FE] text-[#5A66EB]';
      case '처리중':
        return 'bg-yellow-50 text-yellow-600';
      case '처리 완료':
        return 'bg-green-50 text-green-600';
      case '반려됨':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case '접수됨':
        return 'bg-[#5A66EB]';
      case '처리중':
        return 'bg-yellow-400';
      case '처리 완료':
        return 'bg-green-500';
      case '반려됨':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">신고 접수 목록</h2>
        <ul className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['전체', '미처리', '처리중', '처리 완료'].map((tab) => (
            <li key={tab} className="shrink-0">
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeTab === tab
                    ? 'bg-[#5A66EB] text-white border-[#5A66EB]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {filteredReports.map((report) => {
          const currentStatus = report.status || '접수됨';
          return (
            <div
              key={report.id}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusDot(currentStatus)}`}
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    위도 {report.latitude?.toFixed(3)}, 경도{' '}
                    {report.longitude?.toFixed(3)}
                    <span className="text-gray-300 mx-1">|</span>{' '}
                    {report.kickboard_company || '미상'} 킥보드
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatTime(report.created_at)} 접수
                  </div>
                </div>
              </div>
              <span
                className={`text-xs px-3 py-1.5 rounded-md font-medium ${getStatusStyle(currentStatus)}`}
              >
                {currentStatus}
              </span>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            해당 상태의 신고 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTable;

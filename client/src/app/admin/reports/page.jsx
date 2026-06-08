'use client';

import React, { useState } from 'react';
import Header from '@/components/common/header';

const ReportListPage = () => {
  const [activeTab, setActiveTab] = useState('전체');

  const reports = [
    {
      id: 1,
      location: '홍대 입구역 2번출구',
      type: '보도 불법 주차',
      time: '14:34',
      status: '접수됨',
    },
    {
      id: 2,
      location: '성수동 카페거리',
      type: '횡단보도 점거',
      time: '13:51',
      status: '처리중',
    },
    {
      id: 3,
      location: '역삼역 8번출구',
      type: '출입구 막음',
      time: '12:20',
      status: '처리 완료',
    },
    {
      id: 4,
      location: '강남역 1번 출구',
      type: '차도 방치',
      time: '11:05',
      status: '접수됨',
    },
    {
      id: 5,
      location: '성수역 3번 출구',
      type: '주차구역 위반',
      time: '16:05',
      status: '반려됨',
    },
  ];

  const filteredReports = reports.filter((report) => {
    if (activeTab === '전체') return true;
    if (activeTab === '미처리')
      return report.status === '접수됨' || report.status === '반려됨';
    if (activeTab === '처리중') return report.status === '처리중';
    if (activeTab === '처리 완료') return report.status === '처리 완료';
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
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <div className="bg-white pb-4 shadow-sm">
        <Header />
        <div className="px-5 mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            신고 접수 목록
          </h2>
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
      </div>

      <div className="p-5 space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${getStatusDot(report.status)}`}
              />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {report.location}{' '}
                  <span className="text-gray-300 mx-1">|</span> {report.type}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {report.time} 접수
                </div>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1.5 rounded-md font-medium ${getStatusStyle(report.status)}`}
            >
              {report.status}
            </span>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            해당 상태의 신고 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportListPage;

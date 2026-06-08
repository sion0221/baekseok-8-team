'use client';

import React, { useState } from 'react';

const ReportTable = () => {
  const [activeFilter, setActiveFilter] = useState('전체');

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
    if (activeFilter === '전체') return true;
    if (activeFilter === '미처리') return report.status === '접수됨';
    if (activeFilter === '처리중') return report.status === '처리중';
    if (activeFilter === '처리 완료') return report.status === '처리 완료';
    return true;
  });

  const getBadgeStyle = (status) => {
    switch (status) {
      case '접수됨':
        return 'bg-[#F46464] text-white';
      case '처리중':
        return 'bg-[#FADB14] text-white';
      case '처리 완료':
        return 'bg-[#00D1FF] text-white';
      case '반려됨':
        return 'bg-[#F2994A] text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white pt-6 pb-10 w-full max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-6 px-4">
        신고 접수 목록
      </h2>

      <div className="flex justify-center gap-3 mb-6">
        {['전체', '미처리', '처리중', '처리 완료'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-xl border border-gray-600 font-medium text-sm transition-colors ${
              activeFilter === filter
                ? 'bg-[#8F9AA6] text-white'
                : 'bg-[#DEE2E6] text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="w-full">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-t border-b border-black">
              <th className="py-4 font-semibold text-gray-700 text-sm md:text-base">
                위치
              </th>
              <th className="py-4 font-semibold text-gray-700 text-sm md:text-base">
                유형
              </th>
              <th className="py-4 font-semibold text-gray-700 text-sm md:text-base">
                접수 시각
              </th>
              <th className="py-4 font-semibold text-gray-700 text-sm md:text-base">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-200">
                <td className="py-5 font-medium text-gray-900 text-sm md:text-base">
                  {report.location}
                </td>
                <td className="py-5 text-gray-600 text-sm md:text-base">
                  {report.type}
                </td>
                <td className="py-5 text-gray-500 text-sm md:text-base">
                  {report.time}
                </td>
                <td className="py-5">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${getBadgeStyle(report.status)}`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            해당 상태의 신고 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTable;

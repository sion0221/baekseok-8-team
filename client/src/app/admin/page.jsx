'use client';

import React from 'react';
import Header from '@/components/common/header';
import StatCard from '@/components/admin/stat-card';
import SectionHeader from '@/components/admin/section-header';

const AdminDashboard = () => {
  const recentReports = [
    {
      id: 1,
      location: '홍대입구역 2번출구',
      type: '보도 불법주차',
      time: '14:30',
      status: '처리중',
      badge: 'bg-yellow-50 text-yellow-600',
    },
    {
      id: 2,
      location: '홍대입구역 2번출구',
      type: '보도 불법주차',
      time: '14:30',
      status: '접수됨',
      badge: 'bg-[#EDF0FE] text-[#5A66EB]',
    },
    {
      id: 3,
      location: '홍대입구역 2번출구',
      type: '보도 불법주차',
      time: '14:30',
      status: '처리 완료',
      badge: 'bg-green-50 text-green-600',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'kim',
      reason: '오보신고 3회',
      reasonColor: 'text-gray-500',
      btnText: '경고',
      btnStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    {
      id: 2,
      name: 'lee',
      reason: '오보신고 5회',
      reasonColor: 'text-red-500 font-medium',
      btnText: '정지',
      btnStyle: 'bg-[#EF4444] text-white hover:bg-red-600',
    },
  ];

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <Header />

      <div className="p-5 space-y-8">
        <ul className="grid grid-cols-4 gap-2">
          <li>
            <StatCard
              title="전체 신고"
              value="1,284"
              subtitle="이번 달"
              valueColor="text-[#5A66EB]"
            />
          </li>
          <li>
            <StatCard
              title="처리 완료"
              value="1,091"
              subtitle="완료율 85%"
              valueColor="text-[#10B981]"
            />
          </li>
          <li>
            <StatCard
              title="오보 판정"
              value="23"
              subtitle="이번 달"
              valueColor="text-[#EF4444]"
            />
          </li>
          <li>
            <StatCard title="계정 정지" value="3" subtitle="누적" />
          </li>
        </ul>

        <div>
          <SectionHeader title="신고 접수 목록" link="/admin/reports" />
          <ul className="space-y-3">
            {recentReports.map((report) => (
              <li
                key={report.id}
                className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    {report.location}
                  </div>
                  <div className="text-xs text-gray-500">
                    {report.type} · {report.time}
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold ${report.badge}`}
                >
                  {report.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="이용자 관리" link="/admin/users" />
          <ul className="space-y-3">
            {recentUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    {user.name}
                  </div>
                  <div className={`text-xs ${user.reasonColor}`}>
                    {user.reason}
                  </div>
                </div>
                <button
                  className={`text-xs px-4 py-1.5 rounded-md font-semibold transition-colors ${user.btnStyle}`}
                >
                  {user.btnText}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

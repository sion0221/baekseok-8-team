'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/header';
import StatCard from '@/components/admin/stat-card';
import SectionHeader from '@/components/admin/section-header';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    rejected: 0,
    suspended: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [totalRes, compRes, rejRes, suspRes, reportsRes, usersRes] =
          await Promise.all([
            supabase
              .from('reports')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('reports')
              .select('*', { count: 'exact', head: true })
              .eq('status', '처리 완료'),
            supabase
              .from('reports')
              .select('*', { count: 'exact', head: true })
              .eq('status', '반려됨'),
            supabase
              .from('users')
              .select('*', { count: 'exact', head: true })
              .eq('is_suspended', true),
            supabase
              .from('reports')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(3),
            supabase
              .from('users')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(2),
          ]);

        if (totalRes.error) throw totalRes.error;
        if (compRes.error) throw compRes.error;
        if (rejRes.error) throw rejRes.error;
        if (suspRes.error) throw suspRes.error;
        if (reportsRes.error) throw reportsRes.error;
        if (usersRes.error) throw usersRes.error;

        setStats({
          total: totalRes.count || 0,
          completed: compRes.count || 0,
          rejected: rejRes.count || 0,
          suspended: suspRes.count || 0,
        });

        setReports(reportsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const completionRate =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <Header />

      <div className="p-5 space-y-8">
        <ul className="grid grid-cols-4 gap-2">
          <li>
            <StatCard
              title="전체 신고"
              value={stats.total.toLocaleString()}
              subtitle="누적"
              valueColor="text-[#5A66EB]"
            />
          </li>
          <li>
            <StatCard
              title="처리 완료"
              value={stats.completed.toLocaleString()}
              subtitle={`완료율 ${completionRate}%`}
              valueColor="text-[#10B981]"
            />
          </li>
          <li>
            <StatCard
              title="오보 판정"
              value={stats.rejected.toLocaleString()}
              subtitle="누적"
              valueColor="text-[#EF4444]"
            />
          </li>
          <li>
            <StatCard
              title="계정 정지"
              value={stats.suspended.toLocaleString()}
              subtitle="누적"
            />
          </li>
        </ul>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            데이터를 빠르게 불러오는 중입니다...
          </div>
        ) : (
          <>
            <div>
              <SectionHeader title="신고 접수 목록" link="/admin/reports" />
              <ul className="space-y-3">
                {reports.length === 0 ? (
                  <li className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 text-center text-gray-400 text-sm">
                    최근 들어온 신고 내역이 없습니다.
                  </li>
                ) : (
                  reports.map((report) => (
                    <li
                      key={report.id}
                      className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-800 mb-1">
                          {report.kickboard_company || '미상'} 킥보드
                        </div>
                        <div className="text-xs text-gray-500">
                          위도 {report.latitude?.toFixed(3)}, 경도{' '}
                          {report.longitude?.toFixed(3)} ·{' '}
                          {formatTime(report.created_at)}
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-md font-semibold bg-[#EDF0FE] text-[#5A66EB]">
                        {report.status || '접수됨'}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <SectionHeader title="이용자 관리" link="/admin/users" />
              <ul className="space-y-3">
                {users.length === 0 ? (
                  <li className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 text-center text-gray-400 text-sm">
                    관리 대상 이용자가 없습니다.
                  </li>
                ) : (
                  users.map((user) => (
                    <li
                      key={user.id}
                      className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-800 mb-1">
                          {user.nickname}
                        </div>
                        <div className="text-xs text-red-500 font-medium">
                          경고 {user.warning_count}회
                        </div>
                      </div>
                      <button
                        className={`text-xs px-4 py-1.5 rounded-md font-semibold transition-colors ${user.is_suspended ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {user.is_suspended ? '정지됨' : '경고'}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { REPORT_STATUS } from '@/constants';

export default function RecentReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      setReports(data || []);
    };

    fetchReports();
  }, []);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">최근 신고 내역</h2>
        <Link href="/report-board" className="text-[12px] text-[#5A66EB]">
          전체 보기
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {reports.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-4">신고 내역이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {reports.map((report) => {
              const status = REPORT_STATUS[report.status];
              return (
                <li
                  key={report.id}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] px-4 py-3"
                >
                  <span style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: status?.color,
                    flexShrink: 0,
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-gray-800 dark:text-gray-300">
                      {report.kickboard_company || report.ai_company || '미확인'} · {new Date(report.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full whitespace-nowrap ${status?.bg} ${status?.text}`}>
                    {status?.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
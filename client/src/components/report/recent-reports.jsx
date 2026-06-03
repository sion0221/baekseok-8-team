'use client';

import Link from 'next/link';
import { REPORT_STATUS } from '@/constants';
import { MOCK_RECENT_REPORTS } from '@/mocks';

export default function RecentReports() {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-medium text-gray-900">
          최근 신고 내역
        </h2>
        <Link href="/report-board" className="text-[12px] text-[#5A66EB]">
          전체 보기
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {MOCK_RECENT_REPORTS.map((report) => {
          const status = REPORT_STATUS[report.status];
          return (
            <div
              key={report.id}
              className="flex items-center gap-3 bg-white border-[0.5px] border-gray-100 rounded-[12px] px-4 py-3"
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: status?.color,
                  flexShrink: 0,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-gray-800">
                  {report.company} · {report.desc} · {report.time}
                </p>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-1 rounded-full whitespace-nowrap ${status?.bg} ${status?.text}`}
              >
                {status?.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

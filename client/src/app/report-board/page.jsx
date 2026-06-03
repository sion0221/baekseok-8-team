'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  REPORT_STATUS,
  FILTERS,
  PROGRESS_STEPS,
  PROGRESS_STEP_COLOR,
  COMPANY_LOGO,
} from '@/constants';
import { MOCK_RECENT_REPORTS } from '@/mocks';

export default function ReportBoardPage() {
  const [activeFilter, setActiveFilter] = useState('전체');

  const handleFilterClick = (filter) => setActiveFilter(filter);

  const filtered =
    activeFilter === '전체'
      ? MOCK_RECENT_REPORTS
      : MOCK_RECENT_REPORTS.filter((r) => r.status === activeFilter);

  return (
    <div className="py-4">
      {/* 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`text-[12px] px-3 py-1 rounded-full border whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-[#5A66EB] text-white border-[#5A66EB]'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 총 건수 */}
      <p className="text-[13px] text-gray-400 mb-3">총 {filtered.length}건</p>

      {/* 카드 목록 */}
      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {filtered.map((report) => {
          const status = REPORT_STATUS[report.status];

          // 진행바 단계 계산
          // 접수 → 처리중까지 기본, 처리완료면 완료까지
          const progressStep = report.status === '처리완료' ? 2 : 1;

          return (
            // 카드 li 내부
            <li
              key={report.id}
              className="bg-white border-[0.5px] border-gray-100 rounded-[12px] px-4 py-3"
            >
              <div className="flex items-start gap-3">
                {/* 로고 */}
                <div className="w-[48px] h-[48px] rounded-[8px] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {COMPANY_LOGO[report.company] ? (
                    <Image
                      src={COMPANY_LOGO[report.company]}
                      alt={report.company}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-gray-400">
                      {report.company}
                    </span>
                  )}
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-medium text-gray-900 truncate">
                      {report.company} · {report.desc}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${status?.bg} ${status?.text}`}
                    >
                      {status?.label}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-400 mb-2">
                    {report.time}
                  </p>

                  {/* 진행바 */}
                  {report.status !== '반려' && (
                    <div className="flex items-center gap-1">
                      {PROGRESS_STEPS.map((step, index) => {
                        const isActive = index <= progressStep;
                        const color = isActive
                          ? PROGRESS_STEP_COLOR[step]
                          : '#D1D5DB';
                        return (
                          <div key={step} className="flex items-center gap-1">
                            <span
                              style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: color,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{ fontSize: 11, fontWeight: 500, color }}
                            >
                              {step}
                            </span>
                            {index < PROGRESS_STEPS.length - 1 && (
                              <div
                                style={{
                                  width: 24,
                                  height: 1,
                                  margin: '0 4px',
                                  backgroundColor:
                                    index < progressStep
                                      ? PROGRESS_STEP_COLOR[
                                          PROGRESS_STEPS[index + 1]
                                        ]
                                      : '#E5E7EB',
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 상세보기 */}
              <div className="flex justify-end mt-2">
                <Link
                  href={`/report-board/${report.id}`}
                  className="text-[12px] text-[#5A66EB]"
                >
                  상세 보기 →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

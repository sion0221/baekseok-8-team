'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  REPORT_STATUS,
  FILTERS,
  PROGRESS_STEPS,
  PROGRESS_STEP_COLOR,
  COMPANY_LOGO,
} from '@/constants';
import {ChevronRight} from 'lucide-react';

export default function ReportBoardPage() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterClick = (filter) => setActiveFilter(filter);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeFilter !== '전체') {
        query.eq('status', activeFilter);
      }

      const { data, error } = await query;
      if (!error) setReports(data || []);
      setIsLoading(false);
    };

    fetchReports();
  }, [activeFilter]);

  const filtered = reports;

  return (
    <div className="py-4">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`text-[12px] px-3 py-1 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#5A66EB] text-white border-[#5A66EB]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#5A66EB] hover:text-[#5A66EB]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-[13px] text-gray-400 text-center py-8">
          불러오는 중...
        </p>
      ) : (
        <>
          <p className="text-[13px] text-gray-400 mb-3">
            총 {filtered.length}건
          </p>
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {filtered.map((report) => {
              const status = REPORT_STATUS[report.status];
              const progressStep = report.status === '처리완료' ? 2 : 1;

              return (
                <li
                  key={report.id}
                  className="bg-white border-[0.5px] border-gray-100 rounded-[12px] px-4 py-3"
                >
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-[48px] h-[48px] rounded-[8px] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {COMPANY_LOGO[
                        report.kickboard_company || report.ai_company
                      ] ? (
                        <img
                          src={
                            COMPANY_LOGO[
                              report.kickboard_company || report.ai_company
                            ]
                          }
                          alt={report.kickboard_company || report.ai_company}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          {report.kickboard_company || report.ai_company || '?'}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[14px] font-medium text-gray-900">
                          {report.kickboard_company ||
                            report.ai_company ||
                            '미확인'}{' '}
                          · {report.violation_type || report.status}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-1 rounded-full ${status?.bg} ${status?.text}`}
                        >
                          {status?.label}
                        </span>
                      </div>

                      <p className="text-[12px] text-gray-400 mb-2">
                        {new Date(report.created_at).toLocaleString('ko-KR')}
                      </p>

                      {report.status !== '반려' && (
                        <div className="flex items-center gap-1 mb-3">
                          {PROGRESS_STEPS.map((step, index) => {
                            const isActive = index <= progressStep;
                            const color = isActive
                              ? PROGRESS_STEP_COLOR[step]
                              : '#D1D5DB';
                            return (
                              <div
                                key={step}
                                className="flex items-center gap-1"
                              >
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
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color,
                                  }}
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

                  <div className="flex justify-end">
                    <Link
                      href={`/report-board/${report.id}`}
                      className="flex items-center gap-1 text-[12px] text-[#5A66EB]"
                    >
                      상세 보기 <ChevronRight size={14} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

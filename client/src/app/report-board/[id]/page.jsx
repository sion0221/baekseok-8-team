'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { REPORT_STATUS, PROGRESS_STEPS, PROGRESS_STEP_COLOR, TIMELINE } from '@/constants';

export default function ReportDetailPage() {
  const { id } = useParams();
  const mapRef = useRef(null);
  const [report, setReport] = useState(null);
  const [rejectLog, setRejectLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);

      const { data: reportData } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (reportData) {
        setReport(reportData);

        if (reportData.status === '반려') {
          const { data: rejectData } = await supabase
            .from('reject_logs')
            .select('*')
            .eq('report_id', id)
            .single();
          setRejectLog(rejectData);
        }
      }

      setIsLoading(false);
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    if (!report || !mapRef.current) return;

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(report.latitude, report.longitude),
          level: 3,
        });

        const color = REPORT_STATUS[report.status]?.color || '#5A66EB';
        const content = document.createElement('div');
        content.style.cssText = `
          width: 14px;
          height: 14px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        `;

        new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(report.latitude, report.longitude),
          content,
          yAnchor: 1,
        }).setMap(map);
      });
    };

    if (window.kakao) {
      loadMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) script.addEventListener('load', loadMap);
    }
  }, [report]);

  if (isLoading) return <p className="p-4 text-[13px] text-gray-400">불러오는 중...</p>;
  if (!report) return <p className="p-4 text-[13px] text-gray-400">신고를 찾을 수 없어요.</p>;

  const status = REPORT_STATUS[report.status];
  const progressStep = report.status === '처리완료' ? 2 : 1;
  const timeline = TIMELINE[report.status] || [];

  return (
    <div className="py-4 flex flex-col gap-3">
      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 사진</p>
        {report.image_url ? (
          <div className="w-[60%] mx-auto h-[280px] rounded-[8px] overflow-hidden bg-gray-50">
            <img
              src={
                supabase.storage.from('reports').getPublicUrl(report.image_url)
                  .data.publicUrl
              }
              alt="신고 사진"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[160px] rounded-[8px] bg-gray-50">
            <span className="text-[13px] text-gray-300">사진 없음</span>
          </div>
        )}
      </div>

      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 위치</p>
        <div
          ref={mapRef}
          className="w-full h-[140px] rounded-[8px] bg-gray-50"
        />
      </div>

      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 정보</p>
        <dl className="flex flex-col divide-y divide-gray-100">
          {[
            {
              label: '업체',
              value: report.kickboard_company || report.ai_company || '미확인',
            },
            {
              label: '신고 시각',
              value: new Date(report.created_at).toLocaleString('ko-KR'),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <dt className="text-[13px] text-gray-400">{label}</dt>
              <dd className="text-[13px] font-medium text-gray-900">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <dt className="text-[13px] text-gray-400">상태</dt>
            <dd
              className={`text-[11px] font-medium px-2 py-1 rounded-full ${status?.bg} ${status?.text}`}
            >
              {status?.label}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-3">처리 현황</p>

        {report.status !== '반려' && (
          <div className="flex items-center gap-1 mb-4">
            {PROGRESS_STEPS.map((step, index) => {
              const isActive = index <= progressStep;
              const color = isActive ? PROGRESS_STEP_COLOR[step] : '#D1D5DB';
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
                  <span style={{ fontSize: 11, fontWeight: 500, color }}>
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
                            ? PROGRESS_STEP_COLOR[PROGRESS_STEPS[index + 1]]
                            : '#E5E7EB',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {timeline.map((item, index) => {
            const itemStatus = REPORT_STATUS[item.status];
            const color = itemStatus?.color || '#D1D5DB';
            return (
              <li key={index} className="flex items-start gap-3">
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    className={`text-[13px] ${item.status ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    {item.label}
                  </span>
                  {item.status === '반려' && rejectLog?.reason && (
                    <p className="text-[12px] text-red-400 mt-1">
                      사유: {rejectLog.reason}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
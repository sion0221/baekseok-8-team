'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { REPORT_STATUS, PROGRESS_STEPS, TIMELINE } from '@/constants';
import { MOCK_RECENT_REPORTS, MOCK_REPORTS } from '@/mocks';

export default function ReportDetailPage() {
  const { id } = useParams();
  const mapRef = useRef(null);

  const report = MOCK_RECENT_REPORTS.find((r) => r.id === Number(id));
  const mapData = MOCK_REPORTS[Number(id) - 1];

  useEffect(() => {
    if (!report || !mapData) return;

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(mapData.lat, mapData.lng),
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

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(mapData.lat, mapData.lng),
          content,
          yAnchor: 1,
        });

        overlay.setMap(map);
      });
    };

    if (window.kakao) {
      loadMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) script.addEventListener('load', loadMap);
    }
  }, [report, mapData]);

  if (!report)
    return <p className="p-4 text-gray-400">신고를 찾을 수 없어요.</p>;

  const status = REPORT_STATUS[report.status];
  const progressStep = report.status === '처리완료' ? 2 : 1;
  const timeline = TIMELINE[report.status] || [];

  return (
    <div className="py-4 flex flex-col gap-3">

      {/* 신고 사진 */}
      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 사진</p>
        <div className="w-full h-[160px] bg-gray-50 rounded-[8px] flex items-center justify-center">
          <span className="text-[13px] text-gray-300">사진 없음</span>
        </div>
      </div>

      {/* 신고 위치 */}
      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 위치</p>
        <div
          ref={mapRef}
          className="w-full h-[140px] rounded-[8px] bg-gray-50"
        />
      </div>

      {/* 신고 정보 */}
      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-2">신고 정보</p>
        <dl className="flex flex-col divide-y divide-gray-100">
          {[
            { label: '업체', value: report.company },
            { label: '위반 유형', value: report.desc },
            { label: '신고 시각', value: report.created_at },
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

      {/* 처리 현황 */}
      <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 mb-3">처리 현황</p>

        {/* 진행바 */}
        {report.status !== '반려' && (
          <div className="flex items-center gap-1 mb-4">
            {PROGRESS_STEPS.map((step, index) => (
              <div key={step} className="flex items-center gap-1 flex-1">
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    index <= progressStep ? 'text-[#5A66EB]' : 'text-gray-300'
                  }`}
                >
                  {step}
                </span>
                {index < PROGRESS_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-[1px] mx-1 ${
                      index < progressStep ? 'bg-[#5A66EB]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 타임라인 */}
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
                  {/* 반려 사유 */}
                  {item.status === '반려' && report.reject_reason && (
                    <p className="text-[12px] text-red-400 mt-1">
                      사유: {report.reject_reason}
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

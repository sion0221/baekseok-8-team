'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { REPORT_STATUS, FILTERS } from '@/constants';

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [reports, setReports] = useState([]);

  const handleFilterClick = (filter) => setActiveFilter(filter);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      setReports(data || []);
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(36.8394518, 127.1839014),
          level: 4,
        });
      });
    };

    if (window.kakao) {
      loadMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) script.addEventListener('load', loadMap);
    }
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const filtered = activeFilter === '전체'
      ? reports
      : reports.filter((r) => r.status === activeFilter);

    filtered.forEach((report) => {
      const color = REPORT_STATUS[report.status]?.color || '#5A66EB';
      const content = document.createElement('div');
      content.style.cssText = `
        width: 14px;
        height: 14px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(report.latitude, report.longitude),
        content,
        yAnchor: 1,
      });

      overlay.setMap(mapInstanceRef.current);
      overlaysRef.current.push(overlay);
    });
  }, [activeFilter, reports]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-4 h-[52px] bg-white border-b border-gray-100">
        <Link href="/" className="text-[20px] text-gray-500" aria-label="뒤로가기">←</Link>
        <span className="text-[16px] font-medium text-gray-900">전체 신고 지도</span>
      </div>

      <div className="flex gap-2 px-4 py-2 bg-white border-b border-gray-100 overflow-x-auto">
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

      <div ref={mapRef} className="w-full h-[400px]" />

      <div className="flex items-center gap-4 px-4 py-2 bg-white border-t border-gray-100">
        {Object.entries(REPORT_STATUS).map(([status, { color }]) => (
          <span key={status} className="flex items-center gap-1 text-[12px] text-gray-500">
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
            {status}
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2 px-4 py-3 bg-gray-50 list-none p-0 m-0">
        {reports
          .filter((r) => activeFilter === '전체' || r.status === activeFilter)
          .map((report) => {
            const status = REPORT_STATUS[report.status];
            return (
              <li
                key={report.id}
                className="flex items-center gap-3 bg-white border-[0.5px] border-gray-100 rounded-[12px] px-4 py-3"
              >
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: status?.color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-gray-800">
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
    </div>
  );
}
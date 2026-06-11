'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { REPORT_STATUS } from '@/constants';

export default function ReportMap() {
  const mapRef = useRef(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase
        .from('reports')
        .select('id, latitude, longitude, status')
        .order('created_at', { ascending: false });

      setReports(data || []);
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!reports.length) return;

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(36.8394518, 127.1839014),
          level: 4,
        });

        reports.forEach((report) => {
          const color = REPORT_STATUS[report.status]?.color || '#5A66EB';
          const content = `
            <div style="
              width: 14px;
              height: 14px;
              background: ${color};
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              cursor: pointer;
            "></div>
          `;

          new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(
              report.latitude,
              report.longitude,
            ),
            content,
            yAnchor: 1,
          }).setMap(map);
        });
      });
    };

    if (window.kakao) {
      loadMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) script.addEventListener('load', loadMap);
    }
  }, [reports]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
          내 주변 신고 현황
        </h2>
        <Link href="/map" className="text-[12px] text-[#5A66EB]">
          전체 지도 보기
        </Link>
      </div>

      <div
        ref={mapRef}
        className="w-full h-[200px] rounded-[12px] border-[0.5px] border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      />
      {reports.length === 0 && (
        <p className="text-[12px] text-gray-400 text-center mt-2">
          주변 신고 내역이 없어요.
        </p>
      )}

      <div className="flex items-center gap-4 mt-2">
        {Object.entries(REPORT_STATUS).map(([status, { color }]) => (
          <span
            key={status}
            className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400"
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}

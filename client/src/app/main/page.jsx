'use client';

import ReportBanner from '@/components/report/report-banner';
import ReportMap from '@/components/map/report-map';
import RecentReports from '@/components/report/recent-reports';

export default function MainPage() {
  return (
    <div className="py-4">
      <ReportBanner username="사용자" />
      <ReportMap />
      <RecentReports />
    </div>
  );
}

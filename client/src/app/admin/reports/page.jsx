'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/header';
import ReportTable from '@/components/admin/report-table';
import { supabase } from '@/lib/supabase';

const ReportListPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setReports(data);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <Header />

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-sm">
          데이터를 불러오는 중입니다...
        </div>
      ) : (
        <ReportTable reports={reports} />
      )}
    </div>
  );
};

export default ReportListPage;

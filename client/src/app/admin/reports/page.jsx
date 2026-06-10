'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
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

  if (isLoading) return null;

  return (
    <div className="w-full bg-[#F8F9FA] min-h-screen relative pt-[56px] pb-20">
      <Header />

      <div className="max-w-[768px] mx-auto px-5 pt-6 pb-5">
        <ReportTable reports={reports} />
      </div>

      <Footer />
    </div>
  );
};

export default ReportListPage;

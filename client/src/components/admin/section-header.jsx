'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, link }) => {
  return (
    <div className="flex justify-between items-end mb-4 px-1">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <Link
        href={link}
        className="text-xs font-medium text-gray-500 flex items-center hover:text-[#5A66EB] transition-colors group"
      >
        전체보기{' '}
        <ChevronRight className="w-3 h-3 ml-0.5 group-hover:text-[#5A66EB]" />
      </Link>
    </div>
  );
};

export default SectionHeader;

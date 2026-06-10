'use client';

import React from 'react';

const StatCard = ({ title, value, subtitle, valueColor = 'text-gray-900' }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center h-full min-h-[105px]">
      <span className="text-[13px] font-semibold text-gray-500 mb-2 whitespace-nowrap">
        {title}
      </span>

      <span className={`text-2xl font-extrabold ${valueColor} mb-1.5`}>
        {value}
      </span>

      <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
        {subtitle}
      </span>
    </div>
  );
};

export default StatCard;

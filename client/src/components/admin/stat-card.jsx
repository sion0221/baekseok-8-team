'use client';

import React from 'react';

const StatCard = ({ title, value, subtitle, valueColor = 'text-gray-800' }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      <span className="text-[10px] text-gray-500 font-medium mb-1">
        {title}
      </span>
      <span className={`text-lg font-bold ${valueColor}`}>{value}</span>
      <span className="text-[10px] text-gray-400 mt-1">{subtitle}</span>
    </div>
  );
};

export default StatCard;

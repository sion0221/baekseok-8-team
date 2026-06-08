'use client';

import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <button className="text-2xl font-light text-gray-700">≡</button>
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
        BU
      </div>
      <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
        👤
      </button>
    </div>
  );
};

export default Header;

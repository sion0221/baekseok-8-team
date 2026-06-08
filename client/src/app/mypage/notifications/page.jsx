'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const NotificationsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    marketing: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen border-x border-gray-200 pb-20">
      <div className="bg-white flex items-center p-4 shadow-sm relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-gray-600 hover:text-[#5A66EB]"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900">
          알림 설정
        </h1>
      </div>

      <div className="p-5">
        <ul className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <li className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <div className="font-bold text-gray-800 mb-1">앱 푸시 알림</div>
              <div className="text-xs text-gray-500">
                신고 처리 상태 및 주요 공지 알림
              </div>
            </div>
            <button
              onClick={() => toggleSetting('push')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.push ? 'bg-[#5A66EB]' : 'bg-gray-200'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.push ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </li>

          <li className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <div className="font-bold text-gray-800 mb-1">이메일 알림</div>
              <div className="text-xs text-gray-500">
                신고 내역 리포트 및 영수증 알림
              </div>
            </div>
            <button
              onClick={() => toggleSetting('email')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.email ? 'bg-[#5A66EB]' : 'bg-gray-200'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.email ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </li>

          <li className="flex items-center justify-between p-5">
            <div>
              <div className="font-bold text-gray-800 mb-1">
                마케팅 정보 수신
              </div>
              <div className="text-xs text-gray-500">
                이벤트 및 새로운 기능 안내
              </div>
            </div>
            <button
              onClick={() => toggleSetting('marketing')}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.marketing ? 'bg-[#5A66EB]' : 'bg-gray-200'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${settings.marketing ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;

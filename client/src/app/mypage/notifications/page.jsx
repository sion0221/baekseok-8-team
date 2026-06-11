'use client';

import React, { useState } from 'react';

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    marketing: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
    } finally {
      setIsSaving(false);
    }
  };

  const items = [
    { key: 'push', label: '앱 푸시 알림', desc: '신고 처리 상태 및 주요 공지 알림' },
    { key: 'email', label: '이메일 알림', desc: '신고 내역 리포트 및 영수증 알림' },
    { key: 'marketing', label: '마케팅 정보 수신', desc: '이벤트 및 새로운 기능 안내' },
  ];

  return (
    <div className="py-4 flex flex-col gap-3">
      <div className="bg-white dark:bg-gray-800 border-[0.5px] border-gray-100 dark:border-gray-700 rounded-[12px] p-4">
        <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">알림 설정</p>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
          {items.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[14px] font-medium text-[#1E293B] dark:text-gray-200">{label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggleSetting(key)}
                aria-pressed={settings[key]}
                className={`relative w-[44px] h-[24px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                  settings[key] ? 'bg-[#5A66EB]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transform transition-transform ${
                    settings[key] ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-[48px] rounded-[12px] bg-[#5A66EB] text-[15px] font-medium text-white transition-colors cursor-pointer hover:bg-[#4A56DB] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
};

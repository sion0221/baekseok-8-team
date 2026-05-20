"use client";
import React, { useState } from 'react';

// [규칙] 함수형 컴포넌트: PascalCase
// [규칙] 자식 props: onWarnUser
const UserList = ({ users, onWarnUser }) => {
  // [규칙] Boolean 변수: is-
  const [isLoading, setIsLoading] = useState(false);

  // [규칙] 내부 이벤트 처리 함수: handleXxx
  const handleWarningClick = (userId) => {
    setIsLoading(true);
    // 부모에게 알림
    onWarnUser(userId);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 rounded-2xl p-4 mt-6">
      <h3 className="font-bold mb-4">이용자 관리</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold">{user.email}</p>
              <p className="text-xs text-red-500 mt-1">오보신고: {user.falseReportCount}회</p>
            </div>
            <button 
              onClick={() => handleWarningClick(user.id)}
              disabled={isLoading}
              className="text-xs bg-gray-200 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              경고
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
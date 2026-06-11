'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideAlertCircle, LucideCheckCircle2, Loader2 } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [isCustomSameError, setIsCustomSameError] = useState(false);

  const isLengthValid = password.length >= 8;
  const isSameAsOld = isCustomSameError;
  const isConfirmValid =
    password === passwordConfirm && passwordConfirm.length > 0;

  const isFormValid = isLengthValid && !isSameAsOld && isConfirmValid;

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsCustomSameError(false);
    if (serverError) {
      setServerError('');
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setServerError('');
    setIsCustomSameError(false);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.updateUser({
          password: password,
        });

      if (authError) {
        if (
          authError.message.includes(
            'should be different from the old password',
          )
        ) {
          setIsCustomSameError(true);
          setIsLoading(false);
          return;
        }
        throw authError;
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    } catch (err) {
      setServerError(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <Card className="w-full max-w-[390px] border-none shadow-none bg-transparent">
        <CardHeader className="pt-[0px] pb-[32px] px-[24px]">
          <CardTitle className="text-[22px] font-bold text-[#1E293B]">
            새 비밀번호 입력
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center w-full py-[16px]">
              <LucideCheckCircle2 className="w-[48px] h-[48px] mb-[16px] text-[#5A66EB]" />
              <h2 className="mb-[8px] text-[18px] font-semibold text-[#1E293B]">
                변경이 완료되었습니다!
              </h2>
              <p className="text-[14px] text-[#64748B] !leading-[20px]">
                잠시 후 로그인 화면으로 안전하게 이동합니다.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleUpdatePasswordSubmit}
              className="flex flex-col gap-[24px]"
            >
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#1E293B]">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full h-[48px] px-[16px] bg-[#F1F5F9] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  placeholder="새로운 비밀번호 입력"
                />

                {password && (
                  <div className="flex flex-col gap-[4px]">
                    {isSameAsOld && (
                      <p className="text-[12px] text-[#EF4444] font-medium">
                        이전과 동일한 비밀번호는 사용할 수 없습니다.
                      </p>
                    )}
                    {!isSameAsOld && !isLengthValid && (
                      <p className="text-[12px] text-[#EF4444]">
                        비밀번호는 최소 8자리 이상이어야 합니다.
                      </p>
                    )}
                    {!isSameAsOld && isLengthValid && (
                      <p className="text-[12px] text-[#5A66EB] font-medium">
                        사용 가능한 안전한 비밀번호입니다.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#1E293B]">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full h-[48px] px-[16px] bg-[#F1F5F9] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  placeholder="비밀번호 다시 입력"
                />
                {passwordConfirm && !isConfirmValid && (
                  <p className="text-[12px] text-[#EF4444]">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {serverError && (
                <div className="flex items-center gap-[6px] w-full text-[13px] text-[#EF4444] font-medium">
                  <LucideAlertCircle className="w-[14px] h-[14px]" />
                  <span>{serverError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[12px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  isFormValid && !isLoading
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" />
                    <span>변경 처리 중...</span>
                  </>
                ) : (
 
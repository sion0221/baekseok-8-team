'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { LucideAlertCircle, LucideCheckCircle2, Loader2 } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPasswordValid = formData.password.length >= 8;
  const isConfirmValid =
    formData.password === formData.passwordConfirm &&
    formData.passwordConfirm.length > 0;
  const isFormValid = isPasswordValid && isConfirmValid;

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <Card className="w-full max-w-[390px] border-none shadow-none">
        <CardHeader className="flex flex-col items-center pt-[0px] pb-[32px] px-[24px]">
          <CardTitle className="text-[22px] font-bold text-[#1E293B] mb-[8px]">
            새 비밀번호 입력
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center w-full py-[16px]">
              <LucideCheckCircle2 className="w-[48px] h-[48px] mb-[16px] text-[#5A66EB]" />
              <h2 className="mb-[8px] text-[18px] font-semibold text-[#1E293B]">
                비밀번호 변경 완료
              </h2>
              <p className="mb-[24px] text-[14px] text-[#64748B] !leading-[20px]">
                새로운 비밀번호로 성공적으로 변경되었습니다.
                <br />
                다시 로그인 해주세요.
              </p>
              <button
                onClick={() => router.push('/sign-in')}
                className="flex justify-center items-center w-full h-[48px] bg-[#5A66EB] rounded-[12px] text-[15px] font-semibold text-[#FFFFFF] hover:bg-[#4852D4] transition-colors cursor-pointer"
              >
                로그인 화면으로 이동
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUpdateSubmit}
              className="flex flex-col w-full"
            >
              <CardDescription className="mb-[32px] text-[16px] font-medium text-[#1E293B] !leading-[24px]">
                새로 사용할 비밀번호를
                <br />
                8자리 이상 안전하게 입력해주세요
              </CardDescription>

              <div className="flex flex-col gap-[20px] w-full">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    새 비밀번호
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {formData.password && !isPasswordValid && (
                    <p className="text-[12px] text-[#EF4444]">
                      비밀번호는 최소 8자리 이상이어야 합니다.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    새 비밀번호 확인
                  </label>
                  <input
                    name="passwordConfirm"
                    type="password"
                    required
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {formData.passwordConfirm && !isConfirmValid && (
                    <p className="text-[12px] text-[#EF4444]">
                      입력하신 비밀번호와 다릅니다. 다시 확인해주세요.
                    </p>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-[6px] mt-[12px] text-[13px] text-[#EF4444] font-medium">
                  <LucideAlertCircle className="w-[14px] h-[14px]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[60px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  isFormValid && !isLoading
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" />
                    <span>변경 중...</span>
                  </>
                ) : (
                  '비밀번호 변경하기'
                )}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

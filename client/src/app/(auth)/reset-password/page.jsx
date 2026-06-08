'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  LucideAlertCircle,
  LucideCheckCircle2,
  LucideChevronLeft,
  Loader2,
} from 'lucide-react';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(
        '존재하지 않는 회원이거나 이메일 전송 중 에러가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <Card className="w-full max-w-[390px] border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-[12px] pt-[0px] pb-[32px] px-[24px]">
          <Link
            href="/sign-in"
            className="flex items-center justify-center w-[24px] h-[24px] text-[#1E293B] hover:text-[#5A66EB] transition-colors"
          >
            <LucideChevronLeft className="w-[24px] h-[24px]" />
          </Link>
          <CardTitle className="text-[22px] font-bold text-[#1E293B]">
            비밀번호 재설정
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center w-full py-[16px]">
              <LucideCheckCircle2 className="w-[48px] h-[48px] mb-[16px] text-[#5A66EB]" />
              <h2 className="mb-[8px] text-[18px] font-semibold text-[#1E293B]">
                메일 전송 완료
              </h2>
              <p className="mb-[24px] text-[14px] text-[#64748B] !leading-[20px]">
                <span className="font-semibold text-[#1E293B]">{email}</span>{' '}
                주소로
                <br />
                초기화 링크를 발송했습니다.
              </p>
              <Link
                href="/sign-in"
                className="flex justify-center items-center w-full h-[48px] bg-[#5A66EB] rounded-[12px] text-[15px] font-semibold text-[#FFFFFF] hover:bg-[#4852D4] transition-colors"
              >
                로그인 화면으로 이동
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="flex flex-col w-full">
              <CardDescription className="mb-[32px] text-[16px] font-medium text-[#1E293B] !leading-[24px]">
                가입 시 등록한 이메일을 입력하면
                <br />
                비밀번호 변경 링크를 보내드려요
              </CardDescription>

              <div className="flex flex-col gap-[12px] w-full">
                <label className="text-[14px] font-medium text-[#1E293B]">
                  이메일 주소
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                />
                {email && !isEmailValid && (
                  <p className="text-[12px] text-[#EF4444]">
                    올바른 이메일 형식을 채워주셔야 링크가 발송됩니다.
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-[6px] mt-[12px] text-[13px] text-[#EF4444] font-medium">
                  <LucideAlertCircle className="w-[14px] h-[14px]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isEmailValid || isLoading}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[160px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  isEmailValid && !isLoading
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" />
                    <span>전송 중...</span>
                  </>
                ) : (
                  '비밀번호 재설정 메일 보내기'
                )}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LucideChevronLeft,
  LucideCheckCircle2,
  Loader2,
} from 'lucide-react';

export default function FindIdPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [foundEmail, setFoundEmail] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({ email: '', authCode: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email' && emailError) setEmailError('');
    if (name === 'authCode' && errorMessage) setErrorMessage('');
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email);

  // 🎯 Supabase 사양에 맞춰 인증번호 길이 검증을 8자리로 변경
  const isCodeValid = formData.authCode.trim().length === 8;

  const handleSendCodeClick = async () => {
    if (!isEmailValid || isCodeSending) return;

    setIsCodeSending(true);
    setErrorMessage('');

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (dbError || !data) {
        setEmailError('해당 이메일로 가입된 회원 정보가 없습니다.');
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) throw otpError;

      setIsCodeSent(true);
    } catch (err) {
      setErrorMessage('인증번호 전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsCodeSending(false);
    }
  };

  const handleFindIdSubmit = async (e) => {
    e.preventDefault();
    if (!isCodeValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: formData.authCode,
        type: 'email',
      });

      if (verifyError) {
        setErrorMessage('인증코드가 맞지 않거나 만료되었습니다.');
        return;
      }

      // verifyOtp가 세션을 생성하므로 즉시 로그아웃 처리
      await supabase.auth.signOut();

      setFoundEmail(formData.email);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('오류가 발생했습니다. 다시 시도해 주세요.');
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
            아이디 찾기
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center w-full py-[16px]">
              <LucideCheckCircle2 className="w-[48px] h-[48px] mb-[16px] text-[#5A66EB]" />
              <h2 className="mb-[8px] text-[18px] font-semibold text-[#1E293B]">
                아이디 확인 완료
              </h2>
              <p className="mb-[24px] text-[14px] text-[#64748B] !leading-[20px]">
                가입하신 아이디(이메일)는 다음과 같습니다.
                <br />
                <span className="inline-block mt-[8px] px-[12px] py-[6px] bg-[#F1F5F9] rounded-[8px] font-semibold text-[#5A66EB] text-[15px]">
                  {foundEmail}
                </span>
              </p>
              <Link
                href="/sign-in"
                className="flex justify-center items-center w-full h-[48px] bg-[#5A66EB] rounded-[12px] text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#4852D4] transition-colors"
              >
                로그인 하러 가기
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleFindIdSubmit}
              className="flex flex-col w-full"
            >
              <CardDescription className="mb-[32px] text-[16px] font-medium text-[#1E293B] !leading-[24px]">
                가입 시 등록한 이메일을 입력하면
                <br />
                아이디를 알려드려요
              </CardDescription>

              <div className="flex flex-col gap-[24px] w-full">
                <div className="flex flex-col gap-[12px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    이메일 인증
                  </label>
                  <div className="flex gap-[8px] w-full">
                    <input
                      name="email"
                      type="email"
                      required
                      disabled={isLoading || isCodeSending}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleSendCodeClick}
                      disabled={!isEmailValid || isCodeSending || isLoading}
                      className={`flex justify-center items-center w-[90px] h-[48px] rounded-[12px] text-[14px] font-medium transition-colors ${
                        isEmailValid && !isCodeSending && !isLoading
                          ? 'bg-[#5A66EB] text-white hover:bg-[#4852D4] cursor-pointer'
                          : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                      }`}
                    >
                      {isCodeSending ? (
                        <Loader2 className="w-[16px] h-[16px] animate-spin" />
                      ) : isCodeSent ? (
                        '재전송'
                      ) : (
                        '인증 전송'
                      )}
                    </button>
                  </div>

                  {emailError && (
                    <div className="flex items-center gap-[6px] text-[12px] text-[#EF4444] font-medium">
                      <LucideAlertCircle className="w-[14px] h-[14px]" />
                      <span>{emailError}</span>
                    </div>
                  )}
                  {isCodeSent && !emailError && (
                    <div className="flex items-center gap-[6px] text-[12px] text-[#5A66EB] font-medium">
                      <LucideCheckCircle2 className="w-[14px] h-[14px]" />
                      <span>인증코드가 전송되었습니다.</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-[12px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    인증번호 확인
                  </label>
                  <input
                    name="authCode"
                    type="text"
                    required
                    maxLength={8}
                    disabled={!isCodeSent || isLoading}
                    value={formData.authCode}
                    onChange={handleInputChange}
                    placeholder="8자리 인증코드 입력"
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB] disabled:opacity-60"
                  />

                  {errorMessage && (
                    <div className="flex items-center gap-[6px] text-[12px] text-[#EF4444] font-medium">
                      <LucideAlertCircle className="w-[14px] h-[14px]" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  {isCodeSent && (
                    <div className="flex items-center gap-[4px] text-[12px] text-[#64748B]">
                      <span>인증번호가 오지 않았나요?</span>
                      <button
                        type="button"
                        onClick={handleSendCodeClick}
                        className="text-[#5A66EB] underline underline-offset-2 cursor-pointer hover:text-[#4852D4] transition-colors"
                      >
                        재전송
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isCodeValid || isLoading || isCodeSending}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[100px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  isCodeValid && !isLoading && !isCodeSending
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" />
                  </>
                ) : (
                  '확인'
                )}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

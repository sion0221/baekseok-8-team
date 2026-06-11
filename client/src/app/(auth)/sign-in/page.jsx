'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LucideAlertCircle,
  LucideMail,
  LucideLock,
  Loader2,
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/main');
    });
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email);

  const isPasswordValid = formData.password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (err) {
      if (err.message?.includes('Email not confirmed')) {
        setErrorMessage(
          '이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.',
        );
      } else if (err.message?.includes('Invalid login credentials')) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage(err.message || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <Card className="w-full max-w-[390px] border-[#E2E8F0] dark:border-gray-700 rounded-[16px] shadow-sm bg-[#FFFFFF] dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center gap-[16px] pb-[24px]">
          <Image
            src="/logo.svg"
            alt="불법주정차 킥보드 로고 이미지"
            width={100}
            height={100}
            priority
            className="rounded-full"
            style={{ width: 100, height: 100, objectFit: 'cover' }}
          />
          <CardTitle className="text-[24px] font-bold text-[#073462]">
            로그인
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-[16px]"
          >
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-medium text-[#475569] dark:text-gray-400">
                이메일
              </label>
              <div className="relative flex items-center w-full">
                <LucideMail className="absolute left-[16px] w-[18px] h-[18px] text-[#94A3B8]" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-[48px] pl-[44px] pr-[16px] bg-[#F1F5F9] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-medium text-[#475569] dark:text-gray-400">
                비밀번호
              </label>
              <div className="relative flex items-center w-full">
                <LucideLock className="absolute left-[16px] w-[18px] h-[18px] text-[#94A3B8]" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-[48px] pl-[44px] pr-[16px] bg-[#F1F5F9] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-[6px] text-[13px] text-[#EF4444] font-medium">
                <LucideAlertCircle className="w-[14px] h-[14px]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto_1.2fr_auto_1fr] items-center gap-[4px] w-full max-w-[300px] mx-auto mt-[8px] text-[13px] text-[#64748B]">
              <Link
                href="/find-id"
                className="text-center whitespace-nowrap hover:text-[#5A66EB] transition-colors"
              >
                아이디 찾기
              </Link>
              <span className="text-center text-[#E2E8F0]">|</span>
              <Link
                href="/reset-password"
                className="text-center whitespace-nowrap hover:text-[#5A66EB] transition-colors"
              >
                비밀번호 찾기
              </Link>
              <span className="text-center text-[#E2E8F0]">|</span>
              <Link
                href="/sign-up"
                className="text-center whitespace-nowrap hover:text-[#5A66EB] transition-colors"
              >
                회원가입
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex justify-center items-center gap-[8px] w-full h-[48px] mt-[12px] rounded-[12px] text-[16px] font-semibold text-[#FFFFFF] transition-colors ${
                isFormValid && !isLoading
                  ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-[20px] h-[20px] animate-spin" />
                  <span>로그인 중...</span>
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

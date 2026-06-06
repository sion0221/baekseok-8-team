'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LucidePlus,
  LucideAlertCircle,
  LucideCheckCircle2,
  LucideChevronLeft,
  LucideUser,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

export default function SignUpPage() {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(formData.email);

  const isNicknameValid = formData.nickname.trim().length >= 2;
  const isPasswordValid = formData.password.length >= 8;
  const isConfirmValid =
    formData.password === formData.passwordConfirm &&
    formData.passwordConfirm.length > 0;

  const isFormValid =
    isNicknameValid && isEmailValid && isPasswordValid && isConfirmValid;

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setServerError('');
    setEmailError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { nickname: formData.nickname },
        },
      });

      if (authError) {
        if (
          authError.message.includes('already registered') ||
          authError.status === 422
        ) {
          setEmailError('이미 가입된 이메일 주소입니다.');
          setIsLoading(false);
          return;
        }
        throw authError;
      }

      let finalProfileUrl = '';

      if (imageFile && authData?.user) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('profile')
          .getPublicUrl(fileName);

        finalProfileUrl = urlData.publicUrl;

        const { error: dbError } = await supabase
          .from('users')
          .update({ profile_url: finalProfileUrl })
          .eq('id', authData.user.id);

        if (dbError) throw dbError;
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || '회원가입 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <Card className="w-full max-w-[390px] border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center gap-[12px] pt-[0px] pb-[32px] px-[24px]">
          <Link
            href="/sign-in"
            className="flex items-center justify-center w-[24px] h-[24px] text-[#1E293B] hover:text-[#5A66EB] transition-colors"
          >
            <LucideChevronLeft className="w-[24px] h-[24px]" />
          </Link>
          <CardTitle className="text-[22px] font-bold text-[#1E293B]">
            회원가입
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center w-full py-[16px]">
              <LucideCheckCircle2 className="w-[48px] h-[48px] mb-[16px] text-[#5A66EB]" />
              <h2 className="mb-[8px] text-[18px] font-semibold text-[#1E293B]">
                회원가입 완료!
              </h2>
              <p className="mb-[24px] text-[14px] text-[#64748B] !leading-[20px]">
                {formData.nickname}님, 가입을 진심으로 축하드립니다.
                <br />
                지금 바로 서비스를 이용해보세요
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
              onSubmit={handleSignUpSubmit}
              className="flex flex-col items-center gap-[24px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div
                onClick={handleProfileClick}
                className="relative w-[100px] h-[100px] cursor-pointer group"
              >
                <div className="flex items-center justify-center w-full h-full bg-[#D1D5DB] rounded-full overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="프로필 미리보기"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LucideUser className="w-[48px] h-[48px] text-[#94A3B8]" />
                  )}
                </div>

                <button
                  type="button"
                  className="absolute right-0 bottom-0 flex justify-center items-center w-[32px] h-[32px] bg-[#5A66EB] border-[2px] border-white rounded-full hover:bg-[#4852D4] transition-colors"
                >
                  <LucidePlus className="text-white cursor-pointer" />
                </button>
              </div>

              <div className="flex flex-col gap-[20px] w-full">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    사용자 이름
                  </label>
                  <input
                    name="nickname"
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {formData.nickname && !isNicknameValid && (
                    <p className="text-[12px] text-[#EF4444]">
                      이름은 최소 2글자 이상이어야 합니다.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    이메일
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {emailError ? (
                    <p className="text-[12px] text-[#EF4444] font-medium">
                      {emailError}
                    </p>
                  ) : isEmailValid ? (
                    <p className="text-[12px] text-[#5A66EB] font-medium">
                      사용 가능한 이메일 형식입니다.
                    </p>
                  ) : (
                    formData.email && (
                      <p className="text-[12px] text-[#EF4444]">
                        올바른 이메일 주소를 입력해주세요.
                      </p>
                    )
                  )}
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    비밀번호
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
                      비밀번호는 안전하게 8자리 이상 입력해주세요.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-medium text-[#1E293B]">
                    비밀번호 확인
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
                      위에서 입력한 비밀번호와 일치하지 않습니다.
                    </p>
                  )}
                </div>
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
                  isFormValid && !emailError && !isLoading
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-[20px] h-[20px] animate-spin" />
                    <span>가입 진행 중...</span>
                  </>
                ) : (
                  '가입하기'
                )}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
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

  // step: 'form' | 'verify' | 'success'
  const [step, setStep] = useState('form');

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const [nicknameError, setNicknameError] = useState('');
  const [isNicknameChecking, setIsNicknameChecking] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pendingUserId, setPendingUserId] = useState(null);

  const [authCode, setAuthCode] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');

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
      setIsEmailAvailable(false);
    }
    if (name === 'nickname') {
      setNicknameError('');
      setIsNicknameAvailable(false);
    }
  };

  useEffect(() => {
    const delayDebounceTimer = setTimeout(async () => {
      if (formData.nickname.trim().length < 2) {
        setNicknameError('');
        setIsNicknameAvailable(false);
        setIsNicknameChecking(false);
        return;
      }

      setIsNicknameChecking(true);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('nickname')
          .eq('nickname', formData.nickname.trim());

        if (error) throw error;

        if (data && data.length > 0) {
          setNicknameError('이미 존재하는 이름입니다.');
          setIsNicknameAvailable(false);
        } else {
          setNicknameError('');
          setIsNicknameAvailable(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsNicknameChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceTimer);
  }, [formData.nickname]);

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const delayDebounceTimer = setTimeout(async () => {
      if (!formData.email) {
        setEmailError('');
        setIsEmailAvailable(false);
        setIsEmailChecking(false);
        return;
      }

      if (!emailRegex.test(formData.email)) {
        setEmailError('올바른 이메일 주소를 입력해주세요.');
        setIsEmailAvailable(false);
        setIsEmailChecking(false);
        return;
      }

      setIsEmailChecking(true);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('email')
          .eq('email', formData.email.trim());

        if (error) throw error;

        if (data && data.length > 0) {
          setEmailError('이미 가입된 이메일 주소입니다.');
          setIsEmailAvailable(false);
        } else {
          setEmailError('');
          setIsEmailAvailable(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceTimer);
  }, [formData.email]);

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setServerError('PNG 또는 JPG, JPEG 이미지만 가능합니다.');
      e.target.value = '';
      return;
    }
    setServerError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const isNicknameValid = formData.nickname.trim().length >= 2 && isNicknameAvailable;
  const isEmailValid = isEmailAvailable;
  const isPasswordValid = formData.password.length >= 8;
  const isConfirmValid =
    formData.password === formData.passwordConfirm && formData.passwordConfirm.length > 0;
  const isFormValid = isNicknameValid && isEmailValid && isPasswordValid && isConfirmValid;

  // Step 1: 가입 폼 제출 → signUp 후 OTP 인증 단계로
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setServerError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { nickname: formData.nickname },
        },
      });

      if (authError) throw authError;

      setPendingUserId(authData?.user?.id || null);
      setStep('verify');
    } catch (err) {
      setServerError(err.message || '회원가입 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: OTP 인증
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!authCode.trim() || isLoading) return;

    setIsLoading(true);
    setAuthCodeError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: authCode.trim(),
        type: 'signup',
      });

      if (error) {
        setAuthCodeError('인증코드가 맞지 않거나 만료되었습니다.');
        return;
      }

      // 프로필 이미지 업로드
      if (imageFile && (data?.user?.id || pendingUserId)) {
        const userId = data?.user?.id || pendingUserId;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('profile').getPublicUrl(fileName);
          await supabase
            .from('users')
            .update({ profile_url: urlData.publicUrl })
            .eq('id', userId);
        }
      }

      // 인증 후 세션 제거 (로그인 화면으로 유도)
      await supabase.auth.signOut();
      setStep('success');
    } catch (err) {
      setAuthCodeError('오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <Card className="w-full max-w-[390px] border-[#E2E8F0] dark:border-gray-700 rounded-[16px] shadow-sm bg-[#FFFFFF] dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center gap-[12px] pt-[0px] pb-[32px] px-[24px]">
          {step === 'verify' ? (
            <button
              type="button"
              onClick={() => setStep('form')}
              className="flex items-center justify-center w-[24px] h-[24px] text-[#1E293B] hover:text-[#5A66EB] transition-colors"
            >
              <LucideChevronLeft className="w-[24px] h-[24px]" />
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center justify-center w-[24px] h-[24px] text-[#1E293B] hover:text-[#5A66EB] transition-colors"
            >
              <LucideChevronLeft className="w-[24px] h-[24px]" />
            </Link>
          )}
          <CardTitle className="text-[22px] font-bold text-[#1E293B]">
            {step === 'verify' ? '이메일 인증' : '회원가입'}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-[24px]">
          {/* 성공 화면 */}
          {step === 'success' && (
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
          )}

          {/* OTP 인증 화면 */}
          {step === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="flex flex-col w-full">
              <p className="mb-[32px] text-[16px] font-medium text-[#1E293B] !leading-[24px]">
                <span className="font-semibold text-[#5A66EB]">{formData.email}</span>
                <br />
                으로 발송된 인증코드를 입력해주세요
              </p>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#1E293B]">
                  인증코드
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={authCode}
                  onChange={(e) => {
                    setAuthCode(e.target.value);
                    if (authCodeError) setAuthCodeError('');
                  }}
                  placeholder="8자리 인증코드 입력"
                  className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                />
                {authCodeError && (
                  <div className="flex items-center gap-[6px] text-[12px] text-[#EF4444] font-medium">
                    <LucideAlertCircle className="w-[14px] h-[14px]" />
                    <span>{authCodeError}</span>
                  </div>
                )}
                <div className="flex items-center gap-[4px] text-[12px] text-[#64748B] mt-[4px]">
                  <span>인증번호가 오지 않았나요?</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.resend({ type: 'signup', email: formData.email });
                    }}
                    className="text-[#5A66EB] underline underline-offset-2 cursor-pointer hover:text-[#4852D4] transition-colors"
                  >
                    재전송
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authCode.trim().length < 8 || isLoading}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[120px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  authCode.trim().length >= 8 && !isLoading
                    ? 'bg-[#5A66EB] hover:bg-[#4852D4] cursor-pointer'
                    : 'bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-[20px] h-[20px] animate-spin" />
                ) : (
                  '인증 완료'
                )}
              </button>
            </form>
          )}

          {/* 가입 폼 */}
          {step === 'form' && (
            <form
              onSubmit={handleSignUpSubmit}
              className="flex flex-col items-center gap-[24px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
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
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {isNicknameChecking ? (
                    <div className="flex items-center gap-[6px] text-[12px] text-[#64748B] font-medium">
                      <span>확인 중...</span>
                    </div>
                  ) : (
                    <>
                      {formData.nickname && formData.nickname.trim().length < 2 && (
                        <p className="text-[12px] text-[#EF4444]">
                          이름은 최소 2글자 이상이어야 합니다.
                        </p>
                      )}
                      {nicknameError && (
                        <p className="text-[12px] text-[#EF4444] font-medium">
                          {nicknameError}
                        </p>
                      )}
                      {isNicknameAvailable && formData.nickname.trim().length >= 2 && (
                        <p className="text-[12px] text-[#5A66EB] font-medium">
                          사용 가능한 이름입니다.
                        </p>
                      )}
                    </>
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
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
                  />
                  {isEmailChecking ? (
                    <div className="flex items-center gap-[6px] text-[12px] text-[#64748B] font-medium">
                      <span>확인 중...</span>
                    </div>
                  ) : (
                    <>
                      {emailError && (
                        <p className="text-[12px] text-[#EF4444] font-medium">
                          {emailError}
                        </p>
                      )}
                      {isEmailAvailable && formData.email && (
                        <p className="text-[12px] text-[#5A66EB] font-medium">
                          사용 가능한 이메일입니다.
                        </p>
                      )}
                    </>
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
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
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
                    className="w-full h-[48px] px-[16px] bg-[#D1D5DB] dark:bg-gray-700 dark:text-gray-100 border-none rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-[#5A66EB]"
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
                disabled={!isFormValid || isLoading || isNicknameChecking || isEmailChecking}
                className={`flex justify-center items-center gap-[8px] w-full h-[52px] mt-[12px] rounded-[12px] text-[16px] font-bold text-[#FFFFFF] transition-colors ${
                  isFormValid && !isLoading && !isNicknameChecking && !isEmailChecking
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

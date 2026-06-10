'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Check, X } from 'lucide-react';
import { VIOLATION_TYPES, KICKBOARD_COMPANIES } from '@/constants';
import { supabase } from '@/lib/supabase';
import { classifyKickboard } from '@/lib/ai';

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [violationType, setViolationType] = useState(null);
  const [company, setCompany] = useState('');
  const [memo, setMemo] = useState('');
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [aiResult, setAiResult] = useState(null); // AI 판별 결과
  const [aiChecking, setAiChecking] = useState(false); // 판별 진행중
  const mapRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);
  const handleViolationSelect = (type) => setViolationType(type);
  const handleCompanySelect = (e) => setCompany(e.target.value);
  const handleMemoChange = (e) => setMemo(e.target.value);

  const handlePhotoCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(URL.createObjectURL(file));

    // 사진 업로드 즉시 AI 판별 요청
    setAiResult(null);
    setAiChecking(true);
    try {
      const result = await classifyKickboard(file);
      setAiResult(result);
    } catch (err) {
      console.error(err);
      setAiResult({ error: true });
    } finally {
      setAiChecking(false);
    }
  };

  const handleRemovePhoto = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(null);
    setAiResult(null);
    setAiChecking(false);
  };

  const handleSubmit = async () => {
    try {
      const blob = await fetch(photo).then((r) => r.blob());
      const fileExt = blob.type.split('/')[1];
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('reports')
        .upload(fileName, blob);

      if (storageError) return;

      // AI 판별 결과로 접수/반려 결정
      const isKickboard = aiResult?.is_kickboard === true;
      const aiErrored = !aiResult || aiResult.error;

      let status;
      let aiResultText;
      if (aiErrored) {
        // AI 서버 미응답 시 사람이 확인하도록 일단 접수
        status = '접수';
        aiResultText = 'AI 판별 미수행 (서버 미응답)';
      } else if (isKickboard) {
        status = '접수';
        aiResultText = `킥보드 인식됨 (신뢰도 ${aiResult.confidence}%)`;
      } else {
        status = '반려';
        aiResultText = '킥보드 미인식 — AI 1차 자동 반려';
      }

      const { error } = await supabase.from('reports').insert({
        image_url: storageData?.path,
        latitude: location.lat,
        longitude: location.lng,
        kickboard_company: company,
        violation_type: violationType,
        status,
        ai_result: aiResultText,
      });

      if (!error) setStep(3);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  useEffect(() => {
    if (step !== 1) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });

        const loadGeocoder = () => {
          if (!window.kakao?.maps?.services) return;
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const addr =
                result[0]?.road_address?.address_name ||
                result[0]?.address?.address_name ||
                '';
              setNearbyPlace(addr);
            }
          });
        };

        if (window.kakao?.maps?.services) {
          loadGeocoder();
        } else {
          const script = document.querySelector(
            'script[src*="dapi.kakao.com"]',
          );
          if (script) script.addEventListener('load', loadGeocoder);
        }
      },
      () => setLocationError('위치를 가져올 수 없어요.'),
    );
  }, [step]);

  useEffect(() => {
    if (step !== 1 || !location || !mapRef.current) return;

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(location.lat, location.lng),
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(location.lat, location.lng),
          draggable: true,
        });

        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'dragend', () => {
          const pos = marker.getPosition();
          setLocation({ lat: pos.getLat(), lng: pos.getLng() });
        });

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          const pos = mouseEvent.latLng;
          marker.setPosition(pos);
          setLocation({ lat: pos.getLat(), lng: pos.getLng() });
        });
      });
    };

    if (window.kakao) {
      loadMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) script.addEventListener('load', loadMap);
    }
  }, [step, location]);

  const isMobile =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const rejected =
    aiResult && !aiResult.error && aiResult.is_kickboard === false;

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 px-4 mb-6">
        {[1, 2, 3].map((s, index) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full text-[12px] font-medium ${
                s < step
                  ? 'bg-green-500 text-white'
                  : s === step
                    ? 'bg-[#5A66EB] text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {index < 2 && (
              <div
                className={`flex-1 h-[1px] ${
                  s < step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] overflow-hidden">
            <p className="text-[12px] text-gray-400 px-4 pt-4 mb-2">
              GPS 자동 감지
            </p>
            {locationError ? (
              <div className="flex items-center justify-center w-full h-[350px] bg-gray-50">
                <p className="text-[13px] text-gray-400">{locationError}</p>
              </div>
            ) : location ? (
              <div ref={mapRef} className="w-full h-[350px] bg-gray-50" />
            ) : (
              <div className="flex items-center justify-center w-full h-[350px] bg-gray-50">
                <p className="text-[13px] text-gray-400">위치 불러오는 중...</p>
              </div>
            )}
            {location && (
              <>
                <p className="px-4 mt-2 text-[12px] text-[#5A66EB]">
                  위도 {location.lat.toFixed(4)}, 경도 {location.lng.toFixed(4)}
                </p>
                <p className="px-4 mt-1 pb-4 text-[12px] text-gray-400">
                  마커를 드래그하거나 지도를 눌러 정확한 위치를 지정할 수
                  있어요.
                </p>
              </>
            )}
          </div>

          <button
            onClick={handleNextStep}
            disabled={!location}
            className="w-full rounded-[12px] py-3 bg-[#5A66EB] text-[15px] font-medium text-white disabled:opacity-50 transition-opacity"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
            <p className="text-[12px] text-gray-400 mb-3">사진 첨부</p>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[8px] border-[0.5px] border-[#5A66EB] bg-[#5A66EB]/10 gap-1"
              >
                <span className="text-[20px]">📷</span>
                <span className="text-[10px] text-[#5A66EB]">촬영</span>
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                {...(isMobile ? { capture: 'environment' } : {})}
                className="hidden"
                onChange={handlePhotoCapture}
              />

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[8px] border-[0.5px] border-gray-200 gap-1"
              >
                <span className="text-[20px]">🖼️</span>
                <span className="text-[10px] text-gray-400">업로드</span>
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoCapture}
              />
            </div>

            {photo && (
              <div className="relative w-[72px] h-[72px] rounded-[8px] overflow-hidden border-[0.5px] border-gray-200">
                <Image
                  src={photo}
                  alt="신고 사진"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 rounded-bl-[6px] bg-black/50 text-white"
                  aria-label="사진 삭제"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* AI 판별 결과 */}
            {photo && (
              <div className="mt-3 rounded-[8px] border-[0.5px] border-gray-100 p-3">
                <p className="text-[12px] text-gray-400 mb-2">AI 판별 결과</p>

                {aiChecking && (
                  <p className="text-[13px] text-[#5A66EB]">
                    AI가 사진을 분석하는 중...
                  </p>
                )}

                {!aiChecking && aiResult?.error && (
                  <p className="text-[13px] text-red-500">
                    AI 서버에 연결할 수 없어요. 서버(python app.py)가 켜져
                    있는지 확인해주세요.
                  </p>
                )}

                {!aiChecking && aiResult && !aiResult.error && (
                  <>
                    {aiResult.is_kickboard ? (
                      <p className="flex items-center gap-1 text-[13px] font-medium text-green-600">
                        <CheckCircle size={15} />
                        킥보드 인식됨 · 신뢰도 {aiResult.confidence}%
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 text-[13px] font-medium text-red-500">
                        <X size={15} />
                        킥보드를 찾지 못했어요. 제출 시 자동 반려될 수 있어요.
                      </p>
                    )}

                    {aiResult.result_image && (
                      <img
                        src={`data:image/jpeg;base64,${aiResult.result_image}`}
                        alt="AI 분석 결과"
                        className="mt-2 w-full max-w-[200px] rounded-[8px] border-[0.5px] border-gray-200"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
            <p className="text-[12px] text-gray-400 mb-3">위반 유형</p>
            <ul className="grid grid-cols-2 gap-2 list-none p-0 m-0">
              {VIOLATION_TYPES.map((type) => (
                <li key={type}>
                  <button
                    onClick={() => handleViolationSelect(type)}
                    className={`w-full rounded-[8px] border-[0.5px] py-3 px-3 text-[13px] text-left transition-colors ${
                      violationType === type
                        ? 'border-[#5A66EB] bg-[#5A66EB]/10 text-[#5A66EB] font-medium'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-[0.5px] border-gray-100 rounded-[12px] p-4">
            <p className="text-[12px] text-gray-400 mb-2">자동 수집 정보</p>
            <dl className="flex flex-col divide-y divide-gray-100">
              <div className="flex items-center justify-between py-2">
                <dt className="text-[13px] text-gray-400">신고 위치</dt>
                <dd className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                  {nearbyPlace || 'GPS 자동 감지'}
                  <span className="rounded-full px-1.5 py-0.5 bg-[#5A66EB]/10 text-[10px] text-[#5A66EB]">
                    GPS
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[13px] text-gray-400">신고 시각</dt>
                <dd className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                  {new Date().toLocaleString('ko-KR')}
                  <span className="rounded-full px-1.5 py-0.5 bg-[#5A66EB]/10 text-[10px] text-[#5A66EB]">
                    자동
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[13px] text-gray-400">킥보드 브랜드</dt>
                <dd className="flex items-center gap-1">
                  <select
                    value={company}
                    onChange={handleCompanySelect}
                    className="bg-transparent text-[13px] font-medium text-gray-900 border-none outline-none"
                  >
                    <option value="">브랜드 선택</option>
                    {KICKBOARD_COMPANIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="rounded-full px-1.5 py-0.5 bg-[#5A66EB]/10 text-[10px] text-[#5A66EB]">
                    AI
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt
                  className={`text-[13px] ${violationType === '기타' ? 'text-red-500 font-medium' : 'text-gray-400'}`}
                >
                  메모
                  {violationType === '기타' && (
                    <span className="text-[11px]"> (필수)</span>
                  )}
                </dt>
                <dd className="flex flex-1 ml-4">
                  <input
                    type="text"
                    value={memo}
                    onChange={handleMemoChange}
                    placeholder={
                      violationType === '기타'
                        ? '기타 선택 시 필수 입력'
                        : '추가 설명 입력 (선택)'
                    }
                    className={`w-full bg-transparent text-[13px] text-right border-none outline-none ${
                      violationType === '기타' && !memo.trim()
                        ? 'text-red-500 placeholder-red-300'
                        : 'text-gray-900 placeholder-gray-300'
                    }`}
                  />
                </dd>
              </div>
            </dl>
          </div>

          <p className="rounded-[8px] px-3 py-2 bg-[#5A66EB]/10 text-[12px] text-[#5A66EB]">
            위치와 시각은 GPS로 자동 수집됩니다. 담당 기관에 자동 전달돼요.
          </p>

          <button
            onClick={handleSubmit}
            disabled={
              !photo ||
              !violationType ||
              !company ||
              aiChecking ||
              (violationType === '기타' && !memo.trim())
            }
            className="w-full rounded-[12px] py-3 bg-[#5A66EB] text-[15px] font-medium text-white disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            {aiChecking ? 'AI 분석 중...' : '신고 제출하기'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-4 py-8">
          {rejected ? (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                <X size={40} className="text-red-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-[20px] font-medium text-gray-900">
                신고가 반려되었습니다
              </h2>
              <p className="text-[14px] text-center text-gray-400">
                AI 1차 판별에서 킥보드를 찾지 못했어요.
                <br />
                킥보드가 잘 보이는 사진으로 다시 신고해주세요.
              </p>
              <Link
                href="/"
                className="w-full rounded-[12px] py-3 bg-[#5A66EB] text-[15px] font-medium text-white text-center"
              >
                홈으로 돌아가기
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50">
                <CheckCircle
                  size={40}
                  className="text-green-500"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-[20px] font-medium text-gray-900">
                신고가 접수되었습니다!
              </h2>
              <p className="text-[14px] text-center text-gray-400">
                신고가 처리되면 알려드릴게요.
              </p>
              <div className="w-full rounded-[12px] border-[0.5px] border-gray-100 bg-white p-4">
                <p className="text-[13px] text-gray-400 mb-1">예상 처리 시간</p>
                <p className="text-[20px] font-medium text-[#5A66EB]">
                  약 15~20분
                </p>
              </div>
              <Link
                href="/"
                className="w-full rounded-[12px] py-3 bg-[#5A66EB] text-[15px] font-medium text-white text-center"
              >
                홈으로 돌아가기
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

import { Home, Camera, ClipboardList, User } from 'lucide-react';

export const NAV_ITEMS = [
  { label: '홈', href: '/', icon: Home },
  { label: '신고하기', href: '/report', icon: Camera },
  { label: '신고게시판', href: '/report-board', icon: ClipboardList },
  { label: '마이페이지', href: '/mypage', icon: User },
];

export const REPORT_STATUS = {
  접수: {
    label: '접수됨',
    color: '#5A66EB',
    bg: 'bg-[#5A66EB]/10',
    text: 'text-[#5A66EB]',
  },
  처리완료: {
    label: '처리 완료',
    color: '#22C55E',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  반려: {
    label: '반려',
    color: '#EF4444',
    bg: 'bg-red-50',
    text: 'text-red-500',
  },
};

export const PROGRESS_STEPS = ['접수', '처리중', '완료'];

export const PROGRESS_STEP_COLOR = {
  접수: '#5A66EB',
  처리중: '#F59E0B',
  완료: '#22C55E',
};

export const FILTERS = ['전체', '접수', '처리완료', '반려'];

export const KICKBOARD_COMPANIES = ['씽씽', '킥고잉', '라임', '빔', '기타'];

export const GRADE = {
  BRONZE: '브론즈',
  SILVER: '실버',
  GOLD: '골드',
};

export const TIMELINE = {
  접수: [
    { label: '신고 접수됨', status: '접수' },
    { label: '처리 완료 대기 중', status: null },
  ],
  처리완료: [
    { label: '신고 접수됨', status: '접수' },
    { label: '처리 완료', status: '처리완료' },
  ],
  반려: [
    { label: '신고 접수됨', status: '접수' },
    { label: '신고 반려됨', status: '반려' },
  ],
};

export const COMPANY_LOGO = {
  씽씽: '/ssing.png',
  킥고잉: '/kickgoing.png',
  라임: '/lime.png',
  빔: '/beam.png',
  기타: null,
};

export const VIOLATION_TYPES = [
  '보도 불법주차',
  '횡단보도 점거',
  '버스정류장 앞',
  '소화전 앞',
  '출입구 막음',
  '기타',
];

export const BACK_BUTTON_PATHS = ['/report', '/map'];
export const MOCK_USER = {
  id: 1,
  nickname: '김백석',
  grade: '브론즈',
  warning_count: 0,
  is_suspended: false,
};

export const MOCK_REPORTS = [
  { lat: 36.8394518, lng: 127.1839014, status: '접수', company: '씽씽', desc: '보도 불법주차', time: '10분 전' },
  { lat: 36.8390, lng: 127.1845, status: '접수', company: '킥고잉', desc: '횡단보도 점거', time: '43분 전' },
  { lat: 36.8400, lng: 127.1830, status: '처리완료', company: '씽씽', desc: '중점구 막음', time: '2시간 전' },
];

export const MOCK_RECENT_REPORTS = [
  {
    id: 1,
    company: '씽씽',
    desc: '보도 불법주차',
    time: '10분 전',
    status: '접수',
    created_at: '2025.05.10 14:23',
  },
  {
    id: 2,
    company: '킥고잉',
    desc: '횡단보도 점거',
    time: '43분 전',
    status: '접수',
    created_at: '2025.05.10 13:40',
  },
  {
    id: 3,
    company: '씽씽',
    desc: '중점구 막음',
    time: '2시간 전',
    status: '처리완료',
    created_at: '2025.05.10 12:05',
  },
  {
    id: 4,
    company: '라임',
    desc: '소화전 앞',
    time: '1일 전',
    status: '반려',
    created_at: '2025.05.09 10:00',
    reject_reason: '현장에 킥보드 없음',
  },
];

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8FAFC] gap-4 px-4">
      <div className="text-center">
        <p className="text-[36px] font-bold text-[#5A66EB] leading-none mb-2">404</p>
        <p className="text-[16px] font-medium text-gray-900 mb-1">페이지를 찾을 수 없어요</p>
        <p className="text-[13px] text-gray-400">주소가 잘못되었거나 삭제된 페이지예요.</p>
      </div>
      <Link
        href="/main"
        className="mt-2 px-6 py-3 rounded-[12px] bg-[#5A66EB] text-[14px] font-medium text-white hover:bg-[#4A56DB] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

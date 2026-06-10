export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 border-[#5A66EB]/20 border-t-[#5A66EB] animate-spin"
      />
      <p className="text-[13px] text-gray-400">불러오는 중...</p>
    </div>
  );
}

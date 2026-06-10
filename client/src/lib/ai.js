// src/lib/ai.js
// 킥보드 AI 판별 서버(Flask, /classify) 호출 헬퍼

const AI_SERVER_URL =
  process.env.NEXT_PUBLIC_AI_SERVER_URL || 'http://localhost:5000';

// file: <input type="file"> 에서 받은 File 또는 Blob
// 반환: { is_kickboard, confidence, message, result_image }
export async function classifyKickboard(file) {
  const formData = new FormData();
  formData.append('file', file, 'report.jpg');

  const res = await fetch(`${AI_SERVER_URL}/classify`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('AI 서버 응답 오류');
  return res.json();
}

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function DELETE(request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: '유저 ID가 없습니다.' }, { status: 400 });
    }

    // Storage 프로필 이미지 삭제 (폴더 방식: userId/profile.*)
    const { data: folderFiles } = await supabaseAdmin.storage
      .from('profile')
      .list(userId);
    if (folderFiles?.length) {
      const paths = folderFiles.map((f) => `${userId}/${f.name}`);
      await supabaseAdmin.storage.from('profile').remove(paths);
    }

    // Storage 루트에 있는 파일 삭제 (회원가입 시 업로드: userId-timestamp.ext)
    const { data: rootFiles } = await supabaseAdmin.storage
      .from('profile')
      .list('', { search: userId });
    if (rootFiles?.length) {
      const paths = rootFiles.map((f) => f.name);
      await supabaseAdmin.storage.from('profile').remove(paths);
    }

    // users 테이블 삭제
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
    if (dbError) throw dbError;

    // Auth 계정 완전 삭제
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

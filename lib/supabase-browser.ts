import { createBrowserClient } from "@supabase/ssr";

// 로그인 화면(클라이언트)에서 쓰는 창고 연결 — 쿠키에 로그인 상태를 저장한다.
export function 브라우저창고() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

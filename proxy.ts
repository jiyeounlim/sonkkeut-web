import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 문 잠그기 — 로그인 화면(/login)만 빼고 전부 로그인된 사람만 들어온다 (PRD 3-1 · 0.7).
export async function proxy(요청: NextRequest) {
  let 응답 = NextResponse.next({ request: 요청 });

  const 창고 = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return 요청.cookies.getAll();
        },
        setAll(쿠키들) {
          쿠키들.forEach(({ name, value }) => 요청.cookies.set(name, value));
          응답 = NextResponse.next({ request: 요청 });
          쿠키들.forEach(({ name, value, options }) => 응답.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await 창고.auth.getUser();

  const 로그인화면인가 = 요청.nextUrl.pathname.startsWith("/login");

  if (!user && !로그인화면인가) {
    const 주소 = 요청.nextUrl.clone();
    주소.pathname = "/login";
    return NextResponse.redirect(주소);
  }

  if (user && 로그인화면인가) {
    const 주소 = 요청.nextUrl.clone();
    주소.pathname = "/today";
    return NextResponse.redirect(주소);
  }

  return 응답;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

"use client";

// PRD 3-1. 로그인 (웹) — A 중앙 카드. 「아이디」는 실제로는 이메일 하나로 들어간다 (관리자 한 명).
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 브라우저창고 } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [이메일, 이메일설정] = useState("");
  const [비밀번호, 비밀번호설정] = useState("");
  const [에러, 에러설정] = useState(false);
  const [보내는중, 보내는중설정] = useState(false);

  async function 로그인하기(e: React.FormEvent) {
    e.preventDefault();
    보내는중설정(true);
    에러설정(false);
    const { error } = await 브라우저창고().auth.signInWithPassword({
      email: 이메일,
      password: 비밀번호,
    });
    보내는중설정(false);
    if (error) {
      에러설정(true);
      return;
    }
    router.replace("/today");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <form
        onSubmit={로그인하기}
        className="flex w-full max-w-[320px] flex-col gap-4 rounded-2xl border border-line bg-card p-6"
      >
        <p className="text-xs font-bold text-accent">손끝공방</p>
        <h1 className="m-0 text-lg font-extrabold">관리자 로그인</h1>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink/65">아이디</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={이메일}
            onChange={(e) => 이메일설정(e.target.value)}
            className="rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-ink/65">비밀번호</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={비밀번호}
            onChange={(e) => 비밀번호설정(e.target.value)}
            className="rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        {에러 && (
          <p className="rounded-lg bg-no-bg px-3 py-2 text-sm font-bold text-no-ink">
            아이디나 비밀번호가 맞지 않습니다
          </p>
        )}

        <button
          type="submit"
          disabled={보내는중}
          className="mt-1 h-11 rounded-lg bg-accent text-sm font-bold text-white disabled:opacity-60"
        >
          {보내는중 ? "확인하는 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

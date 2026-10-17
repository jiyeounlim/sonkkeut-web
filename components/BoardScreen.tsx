"use client";

// PRD 3-5. 알림판 (웹) — 새 공지 쓰는 칸(맨 위, 고정) + 기존 공지 목록
import { useEffect, useState } from "react";
import { useAppState } from "./AppState";
import Loading from "./Loading";
import { 월일 } from "@/lib/날짜";

export default function BoardScreen() {
  const { 현재, 공지목록, 에러, 공지올리기, 다시시도 } = useAppState();
  const [글, set글] = useState("");
  const [올리는중, set올리는중] = useState(false);
  const [알림, set알림] = useState<string | null>(null);

  useEffect(() => {
    if (!알림) return;
    const 타이머 = setTimeout(() => set알림(null), 5000);
    return () => clearTimeout(타이머);
  }, [알림]);

  // 쓰는 칸의 첫 줄이 제목, 나머지가 본문 (PRD 8장 기본값)
  const 줄들 = 글.split("\n");
  const 제목 = 줄들[0].trim();
  const 본문 = 줄들.slice(1).join("\n").trim();

  async function 올리기() {
    if (!제목 || 올리는중) return;
    set올리는중(true);
    await 공지올리기(제목, 본문);
    set올리는중(false);
    set글("");
    set알림("공지를 올렸습니다");
  }

  return (
    <div>
      <div role="status" className="mb-4 h-11">
        {에러 ? (
          <p className="flex h-11 items-center justify-between rounded-xl bg-no-bg px-4 text-base font-bold text-no-ink">
            {에러}
            <button type="button" onClick={다시시도} className="underline">
              다시 시도
            </button>
          </p>
        ) : (
          알림 && (
            <p className="flex h-11 items-center rounded-xl bg-ok-bg px-4 text-base font-bold text-ok-ink">
              {알림}
            </p>
          )
        )}
      </div>

      <section className="mb-4 rounded-2xl bg-card p-4">
        <textarea
          id="알림판쓰는칸"
          value={글}
          onChange={(e) => set글(e.target.value)}
          placeholder="새 공지를 적어주세요"
          rows={4}
          className="w-full resize-none rounded-xl border border-line bg-bg p-3 text-base text-ink placeholder:text-ink/65 focus:outline-2 focus:outline-accent"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={올리기}
            disabled={!제목 || 올리는중}
            className="h-10 rounded-xl bg-accent px-5 text-base font-bold text-white disabled:opacity-40"
          >
            올리기
          </button>
        </div>
      </section>

      {현재 === null ? (
        <Loading />
      ) : (
        <section className="rounded-2xl bg-card">
          {공지목록.length === 0 ? (
            <p className="px-6 py-8 text-base text-ink/65">아직 올린 공지가 없습니다</p>
          ) : (
            <ul>
              {공지목록.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between gap-4 border-b border-line px-6 py-3 last:border-b-0"
                >
                  <span className="text-base font-bold">{n.제목}</span>
                  <span className="shrink-0 text-base text-ink/65">{월일(n.올린때)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

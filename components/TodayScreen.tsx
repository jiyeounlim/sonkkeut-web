"use client";

// PRD 3-2. 오늘 클래스 (웹, 메인) + 3-2a. 수강생 자세히 보기
import { useState } from "react";
import { useAppState } from "./AppState";
import Loading from "./Loading";
import type { 신청상태 } from "@/lib/샘플데이터";
import { 같은날, 기록날짜, 날짜로, 시각글자, 신청순서, 한글날짜 } from "@/lib/날짜";

// 웹에는 상태 알약을 쓸 자리가 거의 없다 — 3-2a 신청 기록이 그 자리 (PRD 3.0)
const 상태알약: Record<신청상태, { 글: string; 색: string }> = {
  확정: { 글: "✓ 확정", 색: "bg-ok-bg text-ok-ink" },
  대기: { 글: "대기", 색: "bg-warn-bg text-warn-ink" },
  거절: { 글: "거절", 색: "bg-no-bg text-no-ink" },
  취소: { 글: "취소됨", 색: "bg-no-bg text-no-ink" },
};

export default function TodayScreen() {
  const { 현재, 신청목록, 클래스목록, 수강생목록, 에러, 출석바꾸기, 다시시도 } = useAppState();
  const [열린줄, set열린줄] = useState<string | null>(null); // 한 번에 한 줄만 (3-2a)

  if (현재 === null) return <Loading />;

  const 오늘클래스 = 클래스목록
    .filter((c) => 같은날(날짜로(c.날, 현재), 현재))
    .sort((a, b) => a.시각 - b.시각);

  return (
    <div>
      {/* 안 됨 — 위에 한 줄 + 다시 시도 (PRD 3.0) */}
      {에러 && (
        <p className="mb-4 flex h-11 items-center justify-between rounded-xl bg-no-bg px-4 text-base font-bold text-no-ink">
          {에러}
          <button type="button" onClick={다시시도} className="underline">
            다시 시도
          </button>
        </p>
      )}

      {/* 날짜 줄 — 클래스가 없는 날에도 항상 남는다 */}
      <p className="mb-4 text-[13px] text-ink/65">{한글날짜(현재)} · 오늘 클래스</p>

      {오늘클래스.length === 0 ? (
        <section className="rounded-2xl bg-card">
          <p className="px-6 py-8 text-base text-ink/65">오늘은 클래스가 없습니다</p>
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          {오늘클래스.map((클래스) => {
            // 신청 수는 대기 + 확정 (5장). 명단에는 확정된 사람만 나온다
            const 신청수 = 신청목록.filter(
              (a) => a.클래스id === 클래스.id && (a.상태 === "대기" || a.상태 === "확정"),
            ).length;
            const 명단 = 신청목록
              .filter((a) => a.클래스id === 클래스.id && a.상태 === "확정")
              .sort((a, b) => 신청순서(a.신청한때) - 신청순서(b.신청한때));

            return (
              <section key={클래스.id} className="rounded-2xl bg-card pb-2">
                <header className="flex items-center justify-between px-6 py-4">
                  <h2 className="text-xl font-bold">
                    {시각글자(클래스.시각)} · {클래스.이름}
                  </h2>
                  <span className="rounded-full bg-line px-3 py-1 text-sm font-bold">
                    {신청수}/{클래스.정원}
                  </span>
                </header>

                {명단.length === 0 ? (
                  <p className="px-6 pb-4 text-base text-ink/65">아직 확정된 분이 없습니다</p>
                ) : (
                  <ul>
                    {명단.map((신청) => {
                      const 사람 = 수강생목록.find((s) => s.id === 신청.수강생id)!;
                      const 열림 = 열린줄 === 신청.id;
                      return (
                        // 이름 줄 + 열린 상자를 한 사람으로 묶고, 선은 그 아래에 긋는다 (PRD 3-2 · 3-2a)
                        <li key={신청.id} className="border-b border-line last:border-b-0">
                          <div className="flex items-center gap-3 px-6 py-2">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={신청.출석}
                              aria-label={`${사람.이름} 출석`}
                              onClick={() => 출석바꾸기(신청.id)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 text-base font-bold ${
                                신청.출석
                                  ? "border-accent bg-accent text-white"
                                  : "border-line bg-card"
                              }`}
                            >
                              {신청.출석 ? "✓" : ""}
                            </button>
                            <button
                              type="button"
                              aria-expanded={열림}
                              onClick={() => set열린줄(열림 ? null : 신청.id)}
                              className={`w-32 rounded-full bg-bg px-4 py-1 text-base font-bold ${
                                열림 ? "ring-2 ring-accent" : ""
                              }`}
                            >
                              {사람.이름}
                            </button>
                          </div>
                          {열림 && (
                            <InfoBox 수강생id={사람.id} 닫기={() => set열린줄(null)} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 3-2a — 이름을 누르면 그 줄 아래에 펼쳐지는 연락처 · 신청 기록 (읽기만)
function InfoBox({ 수강생id, 닫기 }: { 수강생id: string; 닫기: () => void }) {
  const { 현재, 신청목록, 클래스목록, 수강생목록 } = useAppState();
  const 사람 = 수강생목록.find((s) => s.id === 수강생id)!;

  // 그 수강생의 신청 전부 — 거절 · 취소 · 지난 것 포함. 클래스 날짜 순, 같은 날이면 시각 순
  const 기록 = 신청목록
    .filter((a) => a.수강생id === 수강생id)
    .map((신청) => ({ 신청, 클래스: 클래스목록.find((c) => c.id === 신청.클래스id)! }))
    .sort((a, b) => a.클래스.날 - b.클래스.날 || a.클래스.시각 - b.클래스.시각);

  return (
    <div className="mx-6 mb-3 rounded-xl border border-line p-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold">{사람.이름}</p>
        <button
          type="button"
          onClick={닫기}
          className="h-9 rounded-xl border border-line bg-bg px-3 text-base font-bold"
        >
          닫기
        </button>
      </div>

      <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-y-3 text-base">
        <dt className="text-ink/65">연락처</dt>
        <dd>{사람.연락처}</dd>

        <dt className="text-ink/65">신청 기록</dt>
        <dd>
          <ul className="flex flex-col gap-2">
            {기록.map(({ 신청, 클래스 }) => {
              const 알약 = 상태알약[신청.상태];
              return (
                <li key={신청.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>
                    {기록날짜(날짜로(클래스.날, 현재!))} {시각글자(클래스.시각)} {클래스.이름}
                  </span>
                  <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${알약.색}`}>
                    {알약.글}
                  </span>
                  {신청.출석 && <span className="text-sm font-bold text-ok-ink">출석 ✓</span>}
                </li>
              );
            })}
          </ul>
        </dd>
      </dl>
    </div>
  );
}

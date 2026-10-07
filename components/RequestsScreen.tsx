"use client";

// PRD 3-3. 받은 신청 (웹) — 승인·거절을 아직 안 한 신청을 한 줄씩
import { useEffect, useState } from "react";
import { useAppState } from "./AppState";
import Loading from "./Loading";
import { 신청순서, 클래스글자 } from "@/lib/날짜";

type 알림 = { 글: string; 종류: "승인" | "거절" };

const 버튼 = "h-10 rounded-xl px-4 text-base font-bold";
const 주버튼 = `${버튼} bg-accent text-white`;
const 테두리버튼 = `${버튼} border border-line bg-bg text-ink`;
const 거절확정버튼 = `${버튼} bg-no-bg text-no-ink`;

export default function RequestsScreen() {
  const { 현재, 신청목록, 클래스목록, 수강생목록, 에러, 상태바꾸기, 다시시도 } = useAppState();
  const [묻는줄, set묻는줄] = useState<string | null>(null); // 한 번에 한 줄만 묻는다
  const [알림, set알림] = useState<알림 | null>(null);

  // 알림은 5초 뒤 사라진다. 새 알림이 오면 앞의 것을 바꿔 끼우고 5초를 다시 센다
  useEffect(() => {
    if (!알림) return;
    const 타이머 = setTimeout(() => set알림(null), 5000);
    return () => clearTimeout(타이머);
  }, [알림]);

  const 대기목록 = 신청목록
    .filter((a) => a.상태 === "대기")
    .sort((a, b) => 신청순서(a.신청한때) - 신청순서(b.신청한때));

  function 이름(수강생id: string) {
    return 수강생목록.find((s) => s.id === 수강생id)!.이름;
  }

  function 승인(id: string, 수강생id: string) {
    상태바꾸기(id, "확정");
    set묻는줄(null);
    set알림({ 글: `${이름(수강생id)}님 신청을 승인했습니다`, 종류: "승인" });
  }

  function 거절(id: string, 수강생id: string) {
    상태바꾸기(id, "거절");
    set묻는줄(null);
    set알림({ 글: `${이름(수강생id)}님 신청을 거절했습니다`, 종류: "거절" });
  }

  return (
    <div>
      {/* 알림 줄 — 자리를 미리 비워 둬서 떴다 사라져도 아래가 밀리지 않는다 */}
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
            <p
              className={`flex h-11 items-center rounded-xl px-4 text-base font-bold ${
                알림.종류 === "승인" ? "bg-ok-bg text-ok-ink" : "bg-no-bg text-no-ink"
              }`}
            >
              {알림.글}
            </p>
          )
        )}
      </div>

      {현재 === null ? (
        <Loading />
      ) : (
        <section className="rounded-2xl bg-card">
          {대기목록.length === 0 ? (
            <p className="px-6 py-8 text-base text-ink/65">대기 중인 신청이 없습니다</p>
          ) : (
            <ul>
              {대기목록.map((신청) => {
                const 클래스 = 클래스목록.find((c) => c.id === 신청.클래스id)!;
                const 사람 = 이름(신청.수강생id);
                return (
                  <li
                    key={신청.id}
                    className="flex items-center gap-4 border-b border-line px-6 py-3 last:border-b-0"
                  >
                    {묻는줄 === 신청.id ? (
                      <>
                        <p className="flex-1 text-base">{사람}님 신청을 거절할까요?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className={거절확정버튼}
                            onClick={() => 거절(신청.id, 신청.수강생id)}
                          >
                            거절하기
                          </button>
                          <button
                            type="button"
                            className={테두리버튼}
                            onClick={() => set묻는줄(null)}
                          >
                            그대로
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="w-24 shrink-0 text-base font-bold">{사람}</span>
                        <span className="flex-1 text-base text-ink/65">
                          {클래스글자(클래스, 현재)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className={주버튼}
                            aria-label={`${사람} 승인`}
                            onClick={() => 승인(신청.id, 신청.수강생id)}
                          >
                            승인
                          </button>
                          <button
                            type="button"
                            className={테두리버튼}
                            aria-label={`${사람} 거절`}
                            onClick={() => set묻는줄(신청.id)}
                          >
                            거절
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

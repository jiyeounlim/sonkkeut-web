"use client";

// PRD 3-4. 주간 (웹) — 이번 주 월~일을 요일별 카드로, 카드 안엔 그날 클래스를 시간 순으로
import { useAppState } from "./AppState";
import Loading from "./Loading";
import { 날짜로, 같은날, 날짜글자, 시각글자 } from "@/lib/날짜";

export default function WeekScreen() {
  const { 현재, 클래스목록, 에러, 다시시도 } = useAppState();

  if (현재 === null) return <Loading />;

  const 요일들 = Array.from({ length: 7 }, (_, 날) => {
    const 날짜 = 날짜로(날, 현재);
    const 그날클래스 = 클래스목록
      .filter((c) => c.날 === 날)
      .sort((a, b) => a.시각 - b.시각);
    return { 날짜, 그날클래스 };
  }).filter(({ 그날클래스 }) => 그날클래스.length > 0); // 열리는 게 없는 요일은 카드를 만들지 않는다

  return (
    <div>
      <div role="status" className="mb-4 h-11">
        {에러 && (
          <p className="flex h-11 items-center justify-between rounded-xl bg-no-bg px-4 text-base font-bold text-no-ink">
            {에러}
            <button type="button" onClick={다시시도} className="underline">
              다시 시도
            </button>
          </p>
        )}
      </div>

      {요일들.length === 0 ? (
        <section className="rounded-2xl bg-card">
          <p className="px-6 py-8 text-base text-ink/65">이번 주는 열리는 클래스가 없습니다</p>
        </section>
      ) : (
        <div className="flex flex-col gap-4">
          {요일들.map(({ 날짜, 그날클래스 }) => (
            <section key={날짜.toISOString()} className="rounded-2xl bg-card p-4">
              <h2 className="mb-2 text-base font-bold">
                {날짜글자(날짜)}
                {같은날(날짜, 현재) && " (오늘)"}
              </h2>
              <ul className="flex flex-col gap-1">
                {그날클래스.map((c) => (
                  <li key={c.id} className="text-base text-ink/65">
                    {시각글자(c.시각)} {c.이름}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

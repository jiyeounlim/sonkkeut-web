// 불러오는 중 — 회색 빈 카드 세 개 (PRD 3.0 공통 상태)
export default function Loading() {
  return (
    <div className="flex flex-col gap-3" aria-label="불러오는 중">
      {[0, 1, 2].map((n) => (
        <div key={n} className="h-16 animate-pulse rounded-2xl bg-ink/10" />
      ))}
    </div>
  );
}

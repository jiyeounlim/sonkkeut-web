"use client";

// PRD 3-10. 클래스 만들기 — 메뉴 맨 끝, 지금 화면 위에 뜨는 창(모달)
import { useState } from "react";
import { useAppState } from "./AppState";

const 종류들 = ["도자기", "가죽공예", "캔들"];
const 시각들 = Array.from({ length: 24 }, (_, i) => i); // 0~23시, 정시만
const 요일글자 = ["일", "월", "화", "수", "목", "금", "토"];

function 미리보기글(날짜: string, 시각: string, 종류: string, 정원: string) {
  if (!날짜 || !시각 || !종류 || !정원) return null;
  const d = new Date(`${날짜}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${요일글자[d.getDay()]}) ${String(시각).padStart(2, "0")}:00 · ${종류} · 정원 ${정원}명`;
}

export default function ClassCreateModal({ onClose }: { onClose: () => void }) {
  const { 클래스만들기, 전역알림띄우기 } = useAppState();
  const [종류, set종류] = useState(종류들[0]);
  const [날짜, set날짜] = useState("");
  const [시각, set시각] = useState("");
  const [정원, set정원] = useState("8");
  const [만드는중, set만드는중] = useState(false);

  const 미리보기 = 미리보기글(날짜, 시각, 종류, 정원);
  const 다채움 = Boolean(날짜 && 시각 && 종류 && 정원);

  async function 만들기() {
    if (!다채움 || 만드는중) return;
    set만드는중(true);
    await 클래스만들기(날짜, Number(시각), 종류, Number(정원));
    set만드는중(false);
    onClose();
    전역알림띄우기("클래스를 만들었습니다");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="클래스만들기제목"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="클래스만들기제목" className="mb-4 text-lg font-extrabold">
          클래스 만들기
        </h2>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-bold text-ink/65">
            종류
            <select
              id="새클래스-종류"
              value={종류}
              onChange={(e) => set종류(e.target.value)}
              className="h-10 rounded-lg border border-line bg-bg px-3 text-base font-normal text-ink"
            >
              {종류들.map((이름) => (
                <option key={이름} value={이름}>
                  {이름}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <label className="flex flex-1 flex-col gap-1 text-sm font-bold text-ink/65">
              날짜
              <input
                id="새클래스-날짜"
                type="date"
                value={날짜}
                onChange={(e) => set날짜(e.target.value)}
                className="h-10 rounded-lg border border-line bg-bg px-3 text-base font-normal text-ink"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm font-bold text-ink/65">
              시각
              <select
                id="새클래스-시각"
                value={시각}
                onChange={(e) => set시각(e.target.value)}
                className="h-10 rounded-lg border border-line bg-bg px-3 text-base font-normal text-ink"
              >
                <option value="">고르기</option>
                {시각들.map((시) => (
                  <option key={시} value={시}>
                    {String(시).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-bold text-ink/65">
            정원
            <input
              id="새클래스-정원"
              type="number"
              min={6}
              max={10}
              value={정원}
              onChange={(e) => set정원(e.target.value)}
              className="h-10 rounded-lg border border-line bg-bg px-3 text-base font-normal text-ink"
            />
          </label>

          {미리보기 && (
            <p className="rounded-lg bg-ok-bg px-3 py-2 text-sm font-bold text-ok-ink">
              {미리보기}
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-line bg-bg px-4 text-base font-bold text-ink"
          >
            취소
          </button>
          <button
            type="button"
            onClick={만들기}
            disabled={!다채움 || 만드는중}
            className="h-10 rounded-xl bg-accent px-4 text-base font-bold text-white disabled:opacity-40"
          >
            {만드는중 ? "만드는 중..." : "만들기"}
          </button>
        </div>
      </div>
    </div>
  );
}

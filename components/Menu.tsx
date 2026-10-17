"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppState } from "./AppState";
import ClassCreateModal from "./ClassCreateModal";

const 메뉴 = [
  { 이름: "오늘", 주소: "/today" },
  { 이름: "받은 신청", 주소: "/requests" },
  { 이름: "주간", 주소: "/week" },
  { 이름: "알림판", 주소: "/board" },
];

// 「/」 는 오늘 클래스 화면이다 (PRD 8장)
function 지금화면인가(주소: string, 경로: string) {
  if (주소 === "/today") return 경로 === "/" || 경로 === "/today";
  return 경로 === 주소;
}

export default function Menu() {
  const 경로 = usePathname();
  const { 쿼리, 전역알림 } = useAppState();
  const [만들기창열림, set만들기창열림] = useState(false);

  return (
    <nav aria-label="메뉴" className="py-4">
      <ul className="flex flex-wrap items-center gap-2">
        {메뉴.map(({ 이름, 주소 }) => {
          const 지금 = 지금화면인가(주소, 경로);
          return (
            <li key={주소}>
              <Link
                href={`${주소}${쿼리}`}
                aria-current={지금 ? "page" : undefined}
                className={
                  지금
                    ? "flex h-10 items-center rounded-full bg-accent px-4 text-base font-bold text-white"
                    : "flex h-10 items-center rounded-full px-4 text-base font-medium text-ink hover:bg-line"
                }
              >
                {이름}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => set만들기창열림(true)}
            className="flex h-10 items-center rounded-full border border-line px-4 text-base font-medium text-ink hover:bg-line"
          >
            클래스 만들기
          </button>
        </li>
      </ul>

      {전역알림 && (
        <p
          role="status"
          className="mt-3 flex h-11 items-center rounded-xl bg-ok-bg px-4 text-base font-bold text-ok-ink"
        >
          {전역알림}
        </p>
      )}

      {만들기창열림 && <ClassCreateModal onClose={() => set만들기창열림(false)} />}
    </nav>
  );
}

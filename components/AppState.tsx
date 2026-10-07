"use client";

// 웹 화면들이 함께 보는 상태 (PRD 10장) — 창고(Supabase) 에서 읽어온다.
// 메뉴로 옮겨도 승인·거절·출석 결과가 유지되고, 이제는 새로고침해도 안 사라진다 (저장됨).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { 수강생, 클래스, 신청, 신청상태 } from "@/lib/샘플데이터";
import { 주월요일 } from "@/lib/날짜";
import { 지금 } from "@/lib/지금";
import { supabase } from "@/lib/supabase";

type 값 = {
  현재: Date | null; // 처음 그리는 순간에는 아직 모른다 (null) — 「불러오는 중」
  쿼리: string; // 메뉴를 눌러도 따라가는 ?today=...
  에러: string | null;
  수강생목록: 수강생[];
  클래스목록: 클래스[];
  신청목록: 신청[];
  상태바꾸기: (id: string, 상태: 신청상태) => void;
  출석바꾸기: (id: string) => void; // 켜져 있으면 끄고, 꺼져 있으면 켠다
  다시시도: () => void;
};

const 상태그릇 = createContext<값 | null>(null);

function 날짜만(날: Date) {
  return new Date(날.getFullYear(), 날.getMonth(), 날.getDate());
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [현재, set현재] = useState<Date | null>(null);
  const [쿼리, set쿼리] = useState("");
  const [에러, set에러] = useState<string | null>(null);
  const [수강생목록, set수강생목록] = useState<수강생[]>([]);
  const [클래스목록, set클래스목록] = useState<클래스[]>([]);
  const [신청목록, set신청목록] = useState<신청[]>([]);
  const [새로고침키, set새로고침키] = useState(0);

  useEffect(() => {
    // 서버에서 그린 것과 어긋나지 않게, 브라우저에 온 뒤에 시계를 읽는다
    const 오늘 = new URLSearchParams(window.location.search).get("today");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    set쿼리(오늘 ? `?today=${오늘}` : "");
    const 현재값 = 지금();
    set현재(현재값);

    const 월요일 = 주월요일(현재값);

    let 취소됨 = false;
    (async () => {
      set에러(null);
      const [학생결과, 클래스결과, 신청결과] = await Promise.all([
        supabase.from("students").select("id, name, phone"),
        supabase.from("classes").select("id, starts_at, name, capacity"),
        supabase.from("applications").select("id, class_id, student_id, status, attended, applied_at"),
      ]);
      if (취소됨) return;

      if (학생결과.error || 클래스결과.error || 신청결과.error) {
        set에러("창고에서 못 불러왔습니다");
        return;
      }

      set수강생목록(
        (학생결과.data ?? []).map((s) => ({ id: s.id, 이름: s.name, 연락처: s.phone })),
      );
      set클래스목록(
        (클래스결과.data ?? []).map((c) => {
          const 시작 = new Date(c.starts_at);
          const 날 = Math.round((날짜만(시작).getTime() - 월요일.getTime()) / 86400000);
          return { id: c.id, 날, 시각: 시작.getHours(), 이름: c.name, 정원: c.capacity };
        }),
      );
      set신청목록(
        (신청결과.data ?? []).map((a) => {
          const 신청때 = new Date(a.applied_at);
          const 날 = Math.round((날짜만(신청때).getTime() - 월요일.getTime()) / 86400000);
          return {
            id: a.id,
            수강생id: a.student_id,
            클래스id: a.class_id,
            상태: a.status as 신청상태,
            출석: a.attended,
            신청한때: { 날, 시: 신청때.getHours(), 분: 신청때.getMinutes() },
          };
        }),
      );
    })();

    return () => {
      취소됨 = true;
    };
  }, [새로고침키]);

  const 상태바꾸기 = useCallback((id: string, 상태: 신청상태) => {
    set신청목록((목록) => 목록.map((a) => (a.id === id ? { ...a, 상태 } : a)));
    supabase
      .from("applications")
      .update({ status: 상태 })
      .eq("id", id)
      .then(({ error }) => {
        if (error) set에러("저장하지 못했습니다");
      });
  }, []);

  const 출석바꾸기 = useCallback((id: string) => {
    let 새값 = false;
    set신청목록((목록) =>
      목록.map((a) => {
        if (a.id !== id) return a;
        새값 = !a.출석;
        return { ...a, 출석: 새값 };
      }),
    );
    supabase
      .from("applications")
      .update({ attended: 새값 })
      .eq("id", id)
      .then(({ error }) => {
        if (error) set에러("저장하지 못했습니다");
      });
  }, []);

  const 다시시도 = useCallback(() => set새로고침키((n) => n + 1), []);

  return (
    <상태그릇.Provider
      value={{ 현재, 쿼리, 에러, 수강생목록, 클래스목록, 신청목록, 상태바꾸기, 출석바꾸기, 다시시도 }}
    >
      {children}
    </상태그릇.Provider>
  );
}

export function useAppState(): 값 {
  const 값 = useContext(상태그릇);
  if (!값) throw new Error("AppStateProvider 안에서만 쓸 수 있습니다");
  return 값;
}

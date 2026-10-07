import type { 신청한때, 클래스 } from "./샘플데이터";

const 요일글자 = ["일", "월", "화", "수", "목", "금", "토"];

// 그 날이 속한 주의 월요일 (00:00)
export function 주월요일(기준: Date): Date {
  const 날 = new Date(기준.getFullYear(), 기준.getMonth(), 기준.getDate());
  const 월요일까지 = (날.getDay() + 6) % 7;
  날.setDate(날.getDate() - 월요일까지);
  return 날;
}

// 샘플 데이터의 「날」 (이번 주 월요일 = 0) 을 실제 날짜로
export function 날짜로(날: number, 기준: Date): Date {
  const 결과 = 주월요일(기준);
  결과.setDate(결과.getDate() + 날);
  return 결과;
}

export function 같은날(가: Date, 나: Date): boolean {
  return (
    가.getFullYear() === 나.getFullYear() &&
    가.getMonth() === 나.getMonth() &&
    가.getDate() === 나.getDate()
  );
}

// 예: 목 9/24
export function 날짜글자(날짜: Date): string {
  return `${요일글자[날짜.getDay()]} ${날짜.getMonth() + 1}/${날짜.getDate()}`;
}

// 예: 9월 21일 (월)
export function 한글날짜(날짜: Date): string {
  return `${날짜.getMonth() + 1}월 ${날짜.getDate()}일 (${요일글자[날짜.getDay()]})`;
}

// 예: 9/21 (월) — 신청 기록에 쓴다
export function 기록날짜(날짜: Date): string {
  return `${날짜.getMonth() + 1}/${날짜.getDate()} (${요일글자[날짜.getDay()]})`;
}

// 예: 18:00
export function 시각글자(시각: number): string {
  return `${String(시각).padStart(2, "0")}:00`;
}

// 신청한 때를 크기 비교할 수 있는 숫자로 (작을수록 오래된 것)
export function 신청순서(때: 신청한때): number {
  return 때.날 * 1440 + 때.시 * 60 + 때.분;
}

// 받은 신청 한 줄의 「클래스 · 시간」 — 오늘이 아니면 날짜를 앞에 붙인다
export function 클래스글자(클래스: 클래스, 기준: Date): string {
  const 날짜 = 날짜로(클래스.날, 기준);
  const 앞 = 같은날(날짜, 기준) ? "" : `${날짜글자(날짜)} `;
  return `${앞}${클래스.이름} · ${시각글자(클래스.시각)}`;
}

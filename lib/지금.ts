// 화면의 「오늘」 · 「지금」 은 여기 한 곳에서만 받는다 (PRD 10장).
// 주소 끝에 ?today=2026-09-21 을 붙이면 그 날 낮 12:00 으로 본다 (개발용).
export function 지금(): Date {
  if (typeof window !== "undefined") {
    const 값 = new URLSearchParams(window.location.search).get("today");
    if (값 && /^\d{4}-\d{2}-\d{2}$/.test(값)) {
      const [년, 월, 일] = 값.split("-").map(Number);
      return new Date(년, 월 - 1, 일, 12, 0, 0);
    }
  }
  return new Date();
}

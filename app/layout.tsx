import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/components/AppState";
import Menu from "@/components/Menu";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "손끝공방",
  description: "공방 원데이 클래스 신청 관리",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${noto.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppStateProvider>
          {/* 모든 웹 화면이 같은 폭 (PRD 3.0) — 메뉴 줄도 이 안에 들어간다 */}
          <div className="mx-auto w-full max-w-[960px] px-6 pb-16">
            <Menu />
            <main>{children}</main>
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}

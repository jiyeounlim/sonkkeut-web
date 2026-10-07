import Menu from "@/components/Menu";

// 로그인한 운영자만 보는 화면들 — 메뉴 줄은 여기에만 있다 (/login 에는 없다).
export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[960px] px-6 pb-16">
      <Menu />
      <main>{children}</main>
    </div>
  );
}

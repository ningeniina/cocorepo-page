import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenmaru = Zen_Maru_Gothic({ subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "即売会向け在庫管理アプリ",
  description: "",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body className={zenmaru.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Flow Academy AI", description: "منصة أكاديمية فلو" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}

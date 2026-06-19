import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow Academy AI",
  description: "محلل ICT عربي لأكاديمية فلو"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

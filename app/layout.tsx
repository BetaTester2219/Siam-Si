import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "../styles.css";

export const metadata: Metadata = {
  title: "Siam Si | Fortune Sticks",
  description: "Mobile fortune-stick experience with Supabase backend foundation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf3e4",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th">
      <body>
        {children}
        <Script src="/script.js?v=20260827-backend-foundation" strategy="afterInteractive" />
      </body>
    </html>
  );
}

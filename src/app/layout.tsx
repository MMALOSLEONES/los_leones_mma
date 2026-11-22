import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Script from "next/script"; // 1. Default import with capital 'S'
import "./globals.css";

export const metadata: Metadata = {
  title: "Los Leones MMA",
  description: "Los Leones MMA",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className="bg-black text-white">
        {children}
        {/* 2. Use <Script> with a loading strategy */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="5f996a40-d690-4fd6-b826-cb79956df482"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

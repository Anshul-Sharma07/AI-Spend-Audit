// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AI Spend Audit — Stop Overpaying for AI Tools",
  description:
    "Free audit tool for startups. Find out exactly which AI subscriptions are wasting money and get a personalized reduction plan in 2 minutes.",
  openGraph: {
    title: "AI Spend Audit — Stop Overpaying for AI Tools",
    description:
      "Find out exactly which AI subscriptions are wasting money. Free 2-minute audit for startups.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

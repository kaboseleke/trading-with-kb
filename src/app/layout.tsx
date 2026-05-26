import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trading With KB — AI Forex Signals",
  description: "AI-powered SMC & ICT Forex signal analysis for swing traders. Real-time signals on M15, H1 & H4 timeframes.",
  keywords: "forex signals, SMC trading, ICT concepts, swing trading, AI trading signals, order blocks, fair value gaps",
  openGraph: {
    title: "Trading With KB — AI Forex Signals",
    description: "AI-powered SMC & ICT Forex signal analysis for swing traders",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="noise">
        {children}
      </body>
    </html>
  );
}

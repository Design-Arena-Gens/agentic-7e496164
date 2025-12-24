import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Social Video Creator",
  description:
    "Autonomous AI agent that plans, scripts, and schedules Instagram Reels and TikTok videos."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

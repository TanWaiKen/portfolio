import type { Metadata } from "next";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Tan Wai Ken - AI Enthusiast",
  description:
    "The portfolio of Tan Wai Ken, an AI and backend engineer building useful workflows, thoughtful applications, and playful experiments.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Chinese Name - Discover Your Perfect Chinese Name",
  description: "Get a personalized Chinese name based on your personality, interests, and aspirations. Beautiful calligraphy included.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
        {children}
      </body>
    </html>
  );
}

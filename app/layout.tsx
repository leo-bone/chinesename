import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Chinese Name Generator - Discover Your Perfect Chinese Name",
  description: "Get a personalized Chinese name based on your personality, interests, and aspirations. Each name comes from classical Chinese poetry with beautiful calligraphy.",
  keywords: ["Chinese name", "name generator", "Chinese culture", "personalized name", "Chinese poetry"],
  authors: [{ name: "Chinese Name Generator" }],
  openGraph: {
    title: "Chinese Name Generator - Discover Your Perfect Chinese Name",
    description: "Get a personalized Chinese name based on your personality, interests, and aspirations. Each name comes from classical Chinese poetry.",
    url: "https://chinesename.uichain.org",
    siteName: "Chinese Name Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese Name Generator - Discover Your Perfect Chinese Name",
    description: "Get a personalized Chinese name based on your personality, interests, and aspirations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

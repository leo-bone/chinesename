"use client";

import { ProProvider } from "@/components/ProProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ProProvider>{children}</ProProvider>;
}

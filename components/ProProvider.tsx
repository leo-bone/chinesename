"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ProStatus {
  isPro: boolean;
  unlockCode: string | null;
  unlockAt: number | null;
}

interface ProContextType {
  proStatus: ProStatus;
  unlock: (code: string) => boolean;
  lock: () => void;
}

const PRO_STORAGE_KEY = "chinesename_pro_status";

// Valid unlock codes (in production, this should be server-side)
const VALID_CODES = [
  "CNPRO2024",
  "CNPRO2025",
  "CNVIP001",
  "CNVIP2024",
  "CNBETA",
];

const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: ReactNode }) {
  const [proStatus, setProStatus] = useState<ProStatus>({
    isPro: false,
    unlockCode: null,
    unlockAt: null,
  });

  // Load status on mount
  useEffect(() => {
    const stored = localStorage.getItem(PRO_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProStatus(data);
      } catch (e) {
        console.error("Failed to parse pro status:", e);
      }
    }
  }, []);

  const unlock = (code: string): boolean => {
    const normalizedCode = code.trim().toUpperCase();
    if (VALID_CODES.includes(normalizedCode)) {
      const newStatus: ProStatus = {
        isPro: true,
        unlockCode: normalizedCode,
        unlockAt: Date.now(),
      };
      setProStatus(newStatus);
      localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(newStatus));
      return true;
    }
    return false;
  };

  const lock = () => {
    const newStatus: ProStatus = {
      isPro: false,
      unlockCode: null,
      unlockAt: null,
    };
    setProStatus(newStatus);
    localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(newStatus));
  };

  return (
    <ProContext.Provider value={{ proStatus, unlock, lock }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error("usePro must be used within a ProProvider");
  }
  return context;
}

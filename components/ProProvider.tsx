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
  isCodeUsed: (code: string) => boolean;
}

const PRO_STORAGE_KEY = "chinesename_pro_status";
const USED_CODES_KEY = "chinesename_used_codes";

// Valid unlock codes - ONE-TIME USE ONLY
// After a code is used, it cannot be used again
const VALID_CODES: Record<string, string> = {
  // Premium codes (2026-04-15)
  "CNAME2026C0DV": "Pro Key",
  "LUCKY2027HX8Q": "Pro Key",
  "GIFTXUQVD": "Pro Key",
  "PROPLUSR44R": "Pro Key",
  "VIPSTARJAXU": "Pro Key",
  "FREEGOLDGC42": "Pro Key",
  "WELCOMEPLUSUENP": "Pro Key",
  "CHINAONE9HD9": "Pro Key",
};

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

  // Check if a code has already been used
  const isCodeUsed = (code: string): boolean => {
    const normalizedCode = code.trim().toUpperCase();
    const usedCodes = JSON.parse(localStorage.getItem(USED_CODES_KEY) || "[]");
    return usedCodes.includes(normalizedCode);
  };

  const unlock = (code: string): boolean => {
    const normalizedCode = code.trim().toUpperCase();
    
    // Check if this is a valid code
    if (!VALID_CODES[normalizedCode]) {
      return false;
    }
    
    // Check if code has already been used
    if (isCodeUsed(normalizedCode)) {
      return false;
    }
    
    // Mark code as used
    const usedCodes = JSON.parse(localStorage.getItem(USED_CODES_KEY) || "[]");
    usedCodes.push(normalizedCode);
    localStorage.setItem(USED_CODES_KEY, JSON.stringify(usedCodes));
    
    // Activate Pro status
    const newStatus: ProStatus = {
      isPro: true,
      unlockCode: normalizedCode,
      unlockAt: Date.now(),
    };
    setProStatus(newStatus);
    localStorage.setItem(PRO_STORAGE_KEY, JSON.stringify(newStatus));
    return true;
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
    <ProContext.Provider value={{ proStatus, unlock, lock, isCodeUsed }}>
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

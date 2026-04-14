"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Lock, X, Check } from "lucide-react";
import { usePro } from "./ProProvider";
import { toast } from "sonner";

interface UnlockPanelProps {
  onClose?: () => void;
  compact?: boolean;
}

export default function UnlockPanel({ onClose, compact = false }: UnlockPanelProps) {
  const { proStatus, unlock } = usePro();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = () => {
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    setIsUnlocking(true);
    setError("");

    setTimeout(() => {
      const success = unlock(code);
      if (success) {
        toast.success("Pro features unlocked!");
        setCode("");
      } else {
        setError("Invalid code. Please try again.");
      }
      setIsUnlocking(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  if (proStatus.isPro) {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 ${compact ? "" : "p-6"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">Pro Unlocked</p>
              <p className="text-sm text-amber-600">Code: {proStatus.unlockCode}</p>
            </div>
          </div>
          <Check className="w-5 h-5 text-green-600" />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Unlock Pro Features</span>
          </div>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => {
              document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Unlock ¥9.9
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-800">Upgrade to Pro</h3>
            <p className="text-sm text-stone-600">Unlock all premium features</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {[
          "9 unique Chinese names",
          "5 classic calligraphy styles",
          "3 signature designs",
          "Upload your photo for signature",
          "Name story card (shareable)",
          "Social media share pack",
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-stone-700">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border border-stone-200">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold text-red-700">¥9.9</span>
          <span className="text-stone-500 line-through">¥29.9</span>
        </div>
        <p className="text-center text-sm text-stone-500 mt-1">Lifetime access</p>
      </div>

      <div className="space-y-3" id="unlock-section">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            type="text"
            placeholder="Enter unlock code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 border-stone-300 focus:border-amber-500"
          />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
          onClick={handleUnlock}
          disabled={isUnlocking}
        >
          {isUnlocking ? "Unlocking..." : "Unlock Pro Features"}
        </Button>
      </div>

      <p className="text-xs text-stone-500 text-center mt-4">
        Already purchased? Enter your code above.
        <br />
        Contact us if you need a code.
      </p>
    </div>
  );
}

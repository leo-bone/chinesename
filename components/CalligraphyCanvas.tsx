"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { usePro } from "./ProProvider";

export type CalligraphyStyle = 
  | "kaishu"     // 楷书 - 颜真卿
  | "xingshu"    // 行书 - 王羲之
  | "caoshu"     // 草书 - 张旭
  | "lishu"      // 隶书 - 汉隶
  | "xuanshu";   // 篆书 - 小篆

interface CalligraphyCanvasProps {
  characters: string;
  style?: CalligraphyStyle;
  onStyleChange?: (style: CalligraphyStyle) => void;
  size?: "small" | "medium" | "large";
  showStyleSelector?: boolean;
  showDownload?: boolean;
  className?: string;
}

// Font families for different calligraphy styles
// Using web-safe fonts with distinct visual characteristics for best cross-device compatibility
const FONT_CONFIG: Record<CalligraphyStyle, { font: string; name: string; desc: string; enName: string }> = {
  kaishu: { font: "'Georgia', 'Times New Roman', serif", name: "宋体", enName: "SongTi", desc: "端庄典雅 · Elegant & Classic" },
  xingshu: { font: "'Palatino Linotype', 'Book Antiqua', serif", name: "楷体", enName: "KaiTi", desc: "端正规范 · Standard & Refined" },
  caoshu: { font: "'Courier New', monospace", name: "隶意", enName: "LiStyle", desc: "古朴方正 · Ancient & Square" },
  lishu: { font: "'Verdana', 'Geneva', sans-serif", name: "圆体", enName: "Rounded", desc: "圆润现代 · Modern & Friendly" },
  xuanshu: { font: "'Impact', 'Arial Black', sans-serif", name: "黑体", enName: "HeiTi", desc: "醒目有力 · Bold & Strong" },
};

const SIZE_CONFIG = {
  small: { canvasWidth: 200, canvasHeight: 100, fontSize: 40 },
  medium: { canvasWidth: 400, canvasHeight: 200, fontSize: 80 },
  large: { canvasWidth: 600, canvasHeight: 300, fontSize: 120 },
};

export default function CalligraphyCanvas({
  characters,
  style = "kaishu",
  onStyleChange,
  size = "medium",
  showStyleSelector = false,
  showDownload = true,
  className = "",
}: CalligraphyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { proStatus } = usePro();
  const [selectedStyle, setSelectedStyle] = useState<CalligraphyStyle>(style);
  const [downloaded, setDownloaded] = useState(false);

  const sizeConfig = SIZE_CONFIG[size];
  const fontConfig = FONT_CONFIG[selectedStyle];

  // Check if style is locked
  const isStyleLocked = (s: CalligraphyStyle): boolean => {
    const allStyles: CalligraphyStyle[] = ["kaishu", "xingshu", "caoshu", "lishu", "xuanshu"];
    const freeStyles: CalligraphyStyle[] = ["kaishu"];
    if (freeStyles.includes(s)) return false;
    return !proStatus.isPro;
  };

  useEffect(() => {
    drawCalligraphy();
  }, [characters, selectedStyle]);

  const drawCalligraphy = () => {
    const canvas = canvasRef.current;
    if (!canvas || !characters) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { canvasWidth, canvasHeight } = sizeConfig;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background - rice paper texture
    ctx.fillStyle = "#fafaf9";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Subtle grid lines
    ctx.strokeStyle = "#e7e5e4";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvasWidth; x += canvasWidth / 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += canvasHeight / 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Style-specific rendering
    const charArray = characters.split("");
    const totalWidth = charArray.length * sizeConfig.fontSize * 0.7;
    const startX = (canvasWidth - totalWidth) / 2 + sizeConfig.fontSize * 0.35;

    switch (selectedStyle) {
      case "kaishu":
        // 宋体 - Elegant serif, classic style
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#1c1917";
        ctx.font = `${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Elegant shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(characters, 0, 0);
        // Add stroke effect
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = 1;
        ctx.strokeText(characters, 0, 0);
        ctx.restore();
        break;

      case "xingshu":
        // 楷体 - Refined, slightly italicized
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(-0.03);
        ctx.fillStyle = "#1e3a5f";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(30, 58, 95, 0.2)";
        ctx.shadowBlur = 3;
        ctx.fillText(characters, 0, 0);
        ctx.restore();
        break;

      case "caoshu":
        // 隶意 - Monospace, wide style
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(1.15, 1);
        ctx.fillStyle = "#3d3d3d";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 2;
        ctx.fillText(characters, 0, 0);
        // Underline effect
        ctx.strokeStyle = "rgba(61, 61, 61, 0.3)";
        ctx.lineWidth = 2;
        const metrics = ctx.measureText(characters);
        ctx.beginPath();
        ctx.moveTo(-metrics.width / 2, sizeConfig.fontSize * 0.6);
        ctx.lineTo(metrics.width / 2, sizeConfig.fontSize * 0.6);
        ctx.stroke();
        ctx.restore();
        break;

      case "lishu":
        // 圆体 - Rounded, friendly
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#5c2d91";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Soft glow
        ctx.shadowColor = "rgba(92, 45, 145, 0.2)";
        ctx.shadowBlur = 5;
        ctx.fillText(characters, 0, 0);
        // Add inner highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillText(characters, -1, -1);
        ctx.restore();
        break;

      case "xuanshu":
        // 黑体 - Bold, strong
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#0c0a09";
        ctx.font = `900 ${sizeConfig.fontSize * 1.1}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Strong shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        // Outline effect
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 2;
        ctx.strokeText(characters, 0, 0);
        ctx.restore();
        break;
    }

    // Reset shadow
    ctx.shadowColor = "transparent";

    // Red seal (chop)
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(canvasWidth - 55, canvasHeight - 55, 40, 40);
    ctx.fillStyle = "#fafaf9";
    ctx.font = "12px serif";
    ctx.fillText("吉", canvasWidth - 35, canvasHeight - 35);
  };

  const handleStyleChange = (newStyle: CalligraphyStyle) => {
    if (isStyleLocked(newStyle)) {
      document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSelectedStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${characters}-${fontConfig.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={className}>
      {/* Canvas */}
      <div className="relative bg-stone-100 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-auto" />
        
        {/* Style Label */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-stone-600">
          {fontConfig.name}
        </div>

        {/* Download Button */}
        {showDownload && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 h-8"
            onClick={handleDownload}
          >
            {downloaded ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Style Selector */}
      {showStyleSelector && (
        <div className="flex flex-wrap gap-2 mt-3">
          {(Object.keys(FONT_CONFIG) as CalligraphyStyle[]).map((s) => {
            const config = FONT_CONFIG[s];
            const locked = isStyleLocked(s);
            return (
              <Button
                key={s}
                size="sm"
                variant={selectedStyle === s ? "default" : "outline"}
                className={`text-xs ${locked ? "opacity-50" : ""} ${selectedStyle === s ? "bg-stone-800" : ""}`}
                onClick={() => handleStyleChange(s)}
              >
                {locked ? "🔒 " : ""}{config.name}
              </Button>
            );
          })}
        </div>
      )}

      {/* Style Description */}
      {showStyleSelector && (
        <p className="text-xs text-stone-500 mt-2">{fontConfig.desc}</p>
      )}
    </div>
  );
}

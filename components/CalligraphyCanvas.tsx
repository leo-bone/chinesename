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

// All styles use Noto Serif SC from Google Fonts — works on ALL devices/mobiles
// Visual differentiation via weight, color, shadow, transform and texture
const FONT_CONFIG: Record<CalligraphyStyle, { font: string; name: string; desc: string; enName: string }> = {
  kaishu: { font: "'Noto Serif SC', 'Noto Sans SC', serif", name: "楷书", enName: "KaiShu", desc: "端正规范 · Upright & Balanced" },
  xingshu: { font: "'Noto Serif SC', serif", name: "行书", enName: "XingShu", desc: "流畅飘逸 · Flowing & Elegant" },
  caoshu: { font: "'Noto Serif SC', serif", name: "隶书", enName: "LiShu", desc: "古朴典雅 · Classical & Dignified" },
  lishu: { font: "'Noto Serif SC', serif", name: "魏碑", enName: "WeiBei", desc: "方正有力 · Bold & Powerful" },
  xuanshu: { font: "'Noto Serif SC', serif", name: "篆书", enName: "ZhuanShu", desc: "古朴庄重 · Ancient & Solemn" },
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
        // 楷书 - 端正规范：竖直、黑色、方正感
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        // Rice paper background
        ctx.fillStyle = "#f9f6f0";
        ctx.fillRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
        ctx.fillStyle = "#111111";
        ctx.font = `700 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.18)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        ctx.restore();
        break;

      case "xingshu":
        // 行书 - 飘逸流畅：墨蓝色、轻微倾斜、连笔感
        ctx.save();
        // Warm paper background
        ctx.fillStyle = "#faf8f3";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(-0.06);
        ctx.fillStyle = "#1a2e5c";
        ctx.font = `400 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(20,40,100,0.22)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
        ctx.fillText(characters, 0, 0);
        // Subtle fly-white effect
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillText(characters, -1, -2);
        ctx.restore();
        break;

      case "caoshu":
        // 隶书 - 古朴典雅：深棕色、横向拉伸、厚重
        ctx.save();
        ctx.fillStyle = "#f5f0e6";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(1.18, 0.88); // 横向拉伸，隶书特征
        ctx.fillStyle = "#3a2010";
        ctx.font = `700 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(60,30,10,0.25)";
        ctx.shadowBlur = 3;
        ctx.fillText(characters, 0, 0);
        // 蚕头燕尾下划装饰
        ctx.scale(1/1.18, 1/0.88);
        ctx.strokeStyle = "rgba(60,30,10,0.35)";
        ctx.lineWidth = sizeConfig.fontSize * 0.03;
        const liMetrics = ctx.measureText(characters);
        ctx.beginPath();
        ctx.moveTo(-liMetrics.width * 0.6, sizeConfig.fontSize * 0.5);
        ctx.lineTo(liMetrics.width * 0.6, sizeConfig.fontSize * 0.5);
        ctx.stroke();
        ctx.restore();
        break;

      case "lishu":
        // 魏碑 - 方正有力：深红棕、粗体、石刻感
        ctx.save();
        ctx.fillStyle = "#ede8df";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // Stone texture
        for (let i = 0; i < 80; i++) {
          ctx.fillStyle = `rgba(100,80,60,${Math.random() * 0.03})`;
          ctx.fillRect(Math.random()*canvasWidth, Math.random()*canvasHeight, 3, 1);
        }
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#4a1a05";
        ctx.font = `900 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(74,26,5,0.4)";
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        // Inner highlight for carved stone look
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillText(characters, -1.5, -1.5);
        ctx.restore();
        break;

      case "xuanshu":
        // 篆书 - 古朴庄重：深墨、极细长、古铜色
        ctx.save();
        ctx.fillStyle = "#f0ebe0";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // Aged paper texture
        for (let i = 0; i < 120; i++) {
          ctx.fillStyle = `rgba(130,100,50,${Math.random() * 0.025})`;
          ctx.fillRect(Math.random()*canvasWidth, Math.random()*canvasHeight, 2, 2);
        }
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(0.82, 1.15); // 纵向拉长，篆书特征
        ctx.fillStyle = "#1a0f00";
        ctx.font = `900 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(139,90,43,0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        // Bronze outline
        ctx.strokeStyle = "rgba(139,90,43,0.2)";
        ctx.lineWidth = 1.5;
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

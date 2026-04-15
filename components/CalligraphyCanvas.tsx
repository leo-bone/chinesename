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
// Using Chinese system fonts with distinct visual characteristics for best cross-device compatibility
const FONT_CONFIG: Record<CalligraphyStyle, { font: string; name: string; desc: string; enName: string }> = {
  kaishu: { font: "'KaiTi', 'STKaiti', '楷体', 'BiauKai', serif", name: "楷书", enName: "KaiShu", desc: "颜真卿风格 · 端正规范" },
  xingshu: { font: "'STXingkai', 'Xingkai SC', '行楷', cursive", name: "行书", enName: "XingShu", desc: "王羲之风格 · 流畅自然" },
  caoshu: { font: "'LiSu', 'LiShu', '隶书', 'HanziPen SC', serif", name: "隶书", enName: "LiShu", desc: "汉隶风格 · 古朴典雅" },
  lishu: { font: "'YouYuan', 'Yuanti SC', '圆体', 'Yuanti', sans-serif", name: "魏碑", enName: "WeiBei", desc: "魏碑风格 · 方正有力" },
  xuanshu: { font: "'SimHei', 'Heiti SC', '黑体', 'Noto Sans CJK SC', sans-serif", name: "篆书", enName: "ZhuanShu", desc: "小篆风格 · 古朴庄重" },
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
        // 楷书 - 颜真卿风格：端正规范、笔画饱满
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#1a1a1a";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 墨韵效果
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        // 描边加强
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.strokeText(characters, 0, 0);
        ctx.restore();
        break;

      case "xingshu":
        // 行书 - 王羲之风格：流畅自然、行云流水
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(-0.02);
        ctx.fillStyle = "#1e3a5f";
        ctx.font = `${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 流畅阴影
        ctx.shadowColor = "rgba(30, 58, 95, 0.15)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        ctx.restore();
        break;

      case "caoshu":
        // 隶书 - 汉隶风格：蚕头燕尾、古朴典雅
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(1.1, 1);
        ctx.fillStyle = "#2d2d2d";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 3;
        ctx.fillText(characters, 0, 0);
        // 下划线装饰
        ctx.strokeStyle = "rgba(45, 45, 45, 0.4)";
        ctx.lineWidth = 2;
        const metrics = ctx.measureText(characters);
        ctx.beginPath();
        ctx.moveTo(-metrics.width / 2, sizeConfig.fontSize * 0.55);
        ctx.lineTo(metrics.width / 2, sizeConfig.fontSize * 0.55);
        ctx.stroke();
        ctx.restore();
        break;

      case "lishu":
        // 魏碑 - 方正有力、骨力遒劲
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#3d2817";
        ctx.font = `bold ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 石刻质感
        ctx.shadowColor = "rgba(61, 40, 23, 0.25)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(characters, 0, 0);
        // 内高光
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillText(characters, -1, -1);
        ctx.restore();
        break;

      case "xuanshu":
        // 篆书 - 小篆风格：古朴庄重、圆润均匀
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.fillStyle = "#0f0f0f";
        ctx.font = `900 ${sizeConfig.fontSize}px ${fontConfig.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 古铜色阴影
        ctx.shadowColor = "rgba(139, 90, 43, 0.3)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillText(characters, 0, 0);
        // 轮廓
        ctx.strokeStyle = "rgba(139, 90, 43, 0.15)";
        ctx.lineWidth = 1;
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

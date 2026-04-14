"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Image, MessageCircle, Globe, Smartphone } from "lucide-react";
import { usePro } from "./ProProvider";

interface NameData {
  characters: string;
  pinyin: string;
  meaning: string;
  source: string;
}

interface SocialSharePackProps {
  name: NameData;
  showModal?: boolean;
  onClose?: () => void;
}

type ShareFormat = "instagram" | "wechat" | "twitter" | "whatsapp" | "card";

const SHARE_FORMATS: Record<ShareFormat, { name: string; icon: typeof Image; width: number; height: number; desc: string }> = {
  instagram: { name: "Instagram", icon: Image, width: 1080, height: 1080, desc: "1:1 方形" },
  wechat: { name: "微信", icon: MessageCircle, width: 900, height: 1200, desc: "朋友圈 3:4" },
  twitter: { name: "Twitter/X", icon: Globe, width: 1200, height: 675, desc: "16:9 横版" },
  whatsapp: { name: "WhatsApp", icon: Smartphone, width: 800, height: 800, desc: "1:1 方形" },
  card: { name: "通用卡片", icon: Image, width: 1200, height: 630, desc: "分享卡片" },
};

export default function SocialSharePack({ name, showModal = false, onClose }: SocialSharePackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { proStatus } = usePro();
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>("instagram");
  const [downloaded, setDownloaded] = useState(false);

  const isLocked = !proStatus.isPro;

  useEffect(() => {
    drawShareCard();
  }, [name, selectedFormat]);

  const drawShareCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const format = SHARE_FORMATS[selectedFormat];
    canvas.width = format.width;
    canvas.height = format.height;

    const w = format.width;
    const h = format.height;

    // Background gradient based on format
    let gradient: CanvasGradient;
    if (selectedFormat === "instagram") {
      gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
    } else if (selectedFormat === "wechat") {
      gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
    } else if (selectedFormat === "twitter") {
      gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#1a1a1a");
    } else {
      gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#f8fafc");
      gradient.addColorStop(1, "#e2e8f0");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Decorative elements
    if (selectedFormat === "instagram") {
      // Radial circles
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.2, 300, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.9, 200, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main content
    const centerX = w / 2;

    if (selectedFormat === "twitter") {
      // Twitter - horizontal layout
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 160px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.characters, w * 0.35, h / 2);

      // Right side text
      ctx.fillStyle = "#e5e5e5";
      ctx.font = "bold 48px 'Noto Serif SC', serif";
      ctx.fillText(name.pinyin, w * 0.7, h / 2 - 60);

      ctx.fillStyle = "#888888";
      ctx.font = "24px 'Noto Sans SC', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(name.meaning.substring(0, 30), w * 0.55, h / 2 + 20);
      if (name.meaning.length > 30) {
        ctx.fillText(name.meaning.substring(30, 60), w * 0.55, h / 2 + 55);
      }

      // Branding
      ctx.fillStyle = "#666666";
      ctx.font = "18px 'Noto Sans SC', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("chinesename.uichain.org", w - 40, h - 40);

    } else if (selectedFormat === "wechat") {
      // WeChat Moments - vertical elegant
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 200px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.characters, centerX, h * 0.35);

      ctx.fillStyle = "#c9a962";
      ctx.font = "italic 40px 'Noto Sans SC', sans-serif";
      ctx.fillText(name.pinyin, centerX, h * 0.52);

      // Divider
      ctx.strokeStyle = "#c9a962";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 100, h * 0.6);
      ctx.lineTo(centerX + 100, h * 0.6);
      ctx.stroke();

      // Meaning
      ctx.fillStyle = "#666666";
      ctx.font = "26px 'Noto Sans SC', sans-serif";
      const meaningLines = wrapText(ctx, name.meaning, w - 100);
      meaningLines.forEach((line, i) => {
        ctx.fillText(line, centerX, h * 0.7 + i * 40);
      });

      // QR hint
      ctx.fillStyle = "#999999";
      ctx.font = "18px 'Noto Sans SC', sans-serif";
      ctx.fillText("扫码获取你的中文名", centerX, h - 60);

    } else if (selectedFormat === "instagram") {
      // Instagram - modern gradient
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 280px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.characters, centerX, h * 0.4);

      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "italic 52px 'Noto Sans SC', sans-serif";
      ctx.fillText(name.pinyin, centerX, h * 0.62);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "28px 'Noto Sans SC', sans-serif";
      ctx.fillText(name.meaning.substring(0, 25) + (name.meaning.length > 25 ? "..." : ""), centerX, h * 0.75);

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "20px 'Noto Sans SC', sans-serif";
      ctx.fillText("chinesename.uichain.org", centerX, h - 60);

    } else {
      // Generic card format
      ctx.fillStyle = "#1c1917";
      ctx.font = "bold 180px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name.characters, centerX, h * 0.4);

      ctx.fillStyle = "#78716c";
      ctx.font = "italic 42px 'Noto Sans SC', sans-serif";
      ctx.fillText(name.pinyin, centerX, h * 0.58);

      ctx.fillStyle = "#44403c";
      ctx.font = "24px 'Noto Sans SC', sans-serif";
      ctx.fillText(name.meaning.substring(0, 35) + (name.meaning.length > 35 ? "..." : ""), centerX, h * 0.72);

      ctx.fillStyle = "#a8a29e";
      ctx.font = "18px 'Noto Sans SC', sans-serif";
      ctx.fillText("chinesename.uichain.org", centerX, h - 50);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split("");
    const lines: string[] = [];
    let currentLine = "";

    for (const char of words) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const format = SHARE_FORMATS[selectedFormat];
    const link = document.createElement("a");
    link.download = `share-${selectedFormat}-${name.characters}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadAll = () => {
    const formats = Object.keys(SHARE_FORMATS) as ShareFormat[];
    let delay = 0;

    formats.forEach((format) => {
      setTimeout(() => {
        setSelectedFormat(format);
        setTimeout(() => handleDownload(), 500);
      }, delay);
      delay += 2000;
    });
  };

  if (isLocked) {
    return (
      <Card className="p-6 bg-stone-50 border-stone-200">
        <div className="text-center py-8">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-stone-400" />
          <h3 className="text-lg font-semibold text-stone-700 mb-2">Social Share Pack</h3>
          <p className="text-sm text-stone-500 mb-4">Unlock Pro to create shareable images for all platforms</p>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Unlock Pro Features
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-stone-200">
      <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-amber-600" />
        Social Share Pack
      </h3>

      <p className="text-sm text-stone-600 mb-4">
        Create optimized images for different social media platforms
      </p>

      {/* Format Selector */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {(Object.keys(SHARE_FORMATS) as ShareFormat[]).map((format) => {
          const config = SHARE_FORMATS[format];
          const Icon = config.icon;
          return (
            <Button
              key={format}
              variant={selectedFormat === format ? "default" : "outline"}
              className={`h-auto py-2 px-1 ${selectedFormat === format ? "bg-stone-800" : ""}`}
              onClick={() => setSelectedFormat(format)}
            >
              <div className="text-center">
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs">{config.name}</div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="relative bg-stone-100 rounded-lg overflow-hidden mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 border-stone-300"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloaded ? "Saved!" : "Download"}
        </Button>
        <Button
          className="flex-1 bg-red-800 hover:bg-red-900 text-white"
          onClick={handleDownloadAll}
        >
          <Download className="w-4 h-4 mr-2" />
          All Formats
        </Button>
      </div>
    </Card>
  );
}

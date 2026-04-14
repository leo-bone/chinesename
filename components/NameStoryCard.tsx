"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award, BookOpen } from "lucide-react";
import { usePro } from "./ProProvider";

interface NameData {
  characters: string;
  pinyin: string;
  meaning: string;
  source: string;
  personalityMatch: string;
}

interface FormData {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
}

interface NameStoryCardProps {
  name: NameData;
  formData: FormData;
  showModal?: boolean;
  onClose?: () => void;
}

export default function NameStoryCard({
  name,
  formData,
  showModal = false,
  onClose,
}: NameStoryCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { proStatus } = usePro();
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  const isLocked = !proStatus.isPro;

  useEffect(() => {
    drawCard();
  }, [name, formData]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Card dimensions - A4 ratio
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fef7f0");
    gradient.addColorStop(0.5, "#fff8f0");
    gradient.addColorStop(1, "#fef3e2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Header decoration
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 32px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText("中华传统文化 · 姓名证书", width / 2, 120);

    // Decorative line
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(width - 200, 150);
    ctx.stroke();

    // Small decorative circles
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(200, 150, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 200, 150, 5, 0, Math.PI * 2);
    ctx.fill();

    // "Certificate of Name" label
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 48px 'Noto Serif SC', serif";
    ctx.fillText("姓名证书", width / 2, 230);

    // Recipient
    ctx.fillStyle = "#451a03";
    ctx.font = "28px 'Noto Sans SC', sans-serif";
    ctx.fillText(`授予：${formData.englishName}`, width / 2, 310);

    // Main name - large calligraphy
    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 200px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText(name.characters, width / 2, 520);

    // Pinyin
    ctx.fillStyle = "#78716c";
    ctx.font = "italic 36px 'Noto Sans SC', sans-serif";
    ctx.fillText(name.pinyin, width / 2, 580);

    // Meaning section
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 28px 'Noto Serif SC', serif";
    ctx.textAlign = "left";
    ctx.fillText("名字寓意", 150, 680);

    ctx.fillStyle = "#1c1917";
    ctx.font = "24px 'Noto Sans SC', sans-serif";
    ctx.fillText(name.meaning, 150, 730);

    // Source section
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 28px 'Noto Serif SC', serif";
    ctx.fillText("出处典故", 150, 820);

    ctx.fillStyle = "#44403c";
    ctx.font = "22px 'Noto Serif SC', serif";
    // Word wrap for source
    const sourceLines = wrapText(ctx, name.source, width - 300);
    sourceLines.forEach((line, i) => {
      ctx.fillText(line, 150, 870 + i * 35);
    });

    // Personality match
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 28px 'Noto Serif SC', serif";
    ctx.fillText("与您的契合", 150, 1000);

    ctx.fillStyle = "#44403c";
    ctx.font = "22px 'Noto Sans SC', sans-serif";
    const matchLines = wrapText(ctx, name.personalityMatch, width - 300);
    matchLines.forEach((line, i) => {
      ctx.fillText(line, 150, 1050 + i * 35);
    });

    // Footer decoration
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 1300);
    ctx.lineTo(width - 150, 1300);
    ctx.stroke();

    // Info row
    ctx.fillStyle = "#78716c";
    ctx.font = "18px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`性别：${formData.gender === 'male' ? '男' : formData.gender === 'female' ? '女' : '中性'}  |  年龄：${formData.age}  |  性格：${getPersonalityLabel(formData.personality)}`, width / 2, 1350);

    // Website
    ctx.fillStyle = "#92400e";
    ctx.font = "20px 'Noto Sans SC', sans-serif";
    ctx.fillText("chinesename.uichain.org", width / 2, 1400);

    // Seal/stamp
    ctx.save();
    ctx.translate(width - 180, height - 180);
    ctx.rotate(-0.2);
    
    // Outer ring
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    // Text in seal
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("名", -20, -10);
    ctx.fillText("至", 20, -10);
    ctx.fillText("诚", -20, 25);
    ctx.fillText("品", 20, 25);
    
    ctx.restore();
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
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  const getPersonalityLabel = (p: string): string => {
    const map: Record<string, string> = {
      "ambitious-driven": "有抱负",
      "calm-peaceful": "沉稳平和",
      "creative-artistic": "创意艺术",
      "wise-thoughtful": "睿智深思",
      "energetic-outgoing": "活力外向",
      "gentle-kind": "温柔善良",
      "strong-resilient": "坚强韧性",
      "curious-intellectual": "好奇求知",
    };
    return map[p] || p;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${name.characters}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], "certificate.png", { type: "image/png" })] })) {
        await navigator.share({
          title: `My Chinese Name: ${name.characters}`,
          text: `I just got my Chinese name "${name.characters}" (${name.pinyin})! Get yours at chinesename.uichain.org`,
          files: [new File([blob], "certificate.png", { type: "image/png" })],
        });
      } else {
        // Fallback: download
        handleDownload();
      }
    } catch (err) {
      console.log("Share cancelled or failed");
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (isLocked) {
    return (
      <Card className="p-6 bg-stone-50 border-stone-200">
        <div className="text-center py-8">
          <Award className="w-12 h-12 mx-auto mb-4 text-stone-400" />
          <h3 className="text-lg font-semibold text-stone-700 mb-2">Name Story Card</h3>
          <p className="text-sm text-stone-500 mb-4">Unlock Pro to create beautiful name certificates</p>
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
        <BookOpen className="w-5 h-5 text-amber-600" />
        Name Story Card
      </h3>

      <p className="text-sm text-stone-600 mb-4">
        Create a beautiful certificate for your name that you can share or print
      </p>

      {/* Canvas Preview */}
      <div className="relative bg-stone-100 rounded-lg overflow-hidden mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-red-800 hover:bg-red-900 text-white"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloaded ? "Saved!" : "Save Card"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-stone-300"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {shared ? "Shared!" : "Share"}
        </Button>
      </div>
    </Card>
  );
}

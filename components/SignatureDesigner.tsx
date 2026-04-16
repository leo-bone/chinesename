"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Eraser, Type, Image, PenTool } from "lucide-react";
import { usePro } from "./ProProvider";

export type SignatureStyle = "cursive" | "formal" | "artistic1" | "artistic2";

interface SignatureDesignerProps {
  characters: string;
  pinyin: string;
  showModal?: boolean;
  onClose?: () => void;
}

// All signature styles use Noto Serif SC — fully cross-device compatible
const SIGNATURE_STYLES: Record<SignatureStyle, { name: string; desc: string; font: string }> = {
  cursive: {
    name: "飘逸签名 · Cursive",
    desc: "流畅自然，行云流水",
    font: "'Noto Serif SC', serif",
  },
  formal: {
    name: "正式签名 · Formal",
    desc: "端庄稳重，方正大气",
    font: "'Noto Serif SC', serif",
  },
  artistic1: {
    name: "艺术签名1 · Artistic 1",
    desc: "优雅灵动，墨韵飘逸",
    font: "'Noto Serif SC', serif",
  },
  artistic2: {
    name: "艺术签名2 · Artistic 2",
    desc: "大气磅礴，气势如虹",
    font: "'Noto Serif SC', serif",
  },
};

export default function SignatureDesigner({
  characters,
  pinyin,
  showModal = false,
  onClose,
}: SignatureDesignerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { proStatus } = usePro();

  const [selectedStyle, setSelectedStyle] = useState<SignatureStyle>("artistic1");
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0.7, y: 0.7, scale: 0.3 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const isLocked = !proStatus.isPro;

  useEffect(() => {
    drawSignature();
  }, [characters, selectedStyle, customText, uploadedImage, imagePosition]);

  const drawSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !characters) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const style = SIGNATURE_STYLES[selectedStyle];
    const displayText = customText || characters;

    // ── Step 1: Draw background (photo or style-specific paper) ──
    if (uploadedImage) {
      // Photo as full-canvas background
      const scale = Math.max(canvas.width / uploadedImage.width, canvas.height / uploadedImage.height);
      const imgW = uploadedImage.width * scale;
      const imgH = uploadedImage.height * scale;
      const imgX = (canvas.width - imgW) / 2;
      const imgY = (canvas.height - imgH) / 2;
      ctx.drawImage(uploadedImage, imgX, imgY, imgW, imgH);
      // Semi-transparent dark overlay so signature is always readable
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Style-specific paper background
      const bgColors: Record<SignatureStyle, string> = {
        cursive: "#fefefe",
        formal: "#f8f6f2",
        artistic1: "#faf8f5",
        artistic2: "#f5f0e6",
      };
      ctx.fillStyle = bgColors[selectedStyle];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ── Step 2: Draw signature on top ──
    const signatureColor = uploadedImage ? "#ffffff" : undefined;

    if (selectedStyle === "cursive") {
      // 飘逸 - flowing, slight tilt, thin weight, ink trail
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
      ctx.rotate(-0.06);
      ctx.fillStyle = signatureColor || "#1c1917";
      ctx.font = `300 80px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = signatureColor ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;
      ctx.fillText(displayText, 0, 0);
      ctx.restore();
      // Pinyin
      ctx.fillStyle = signatureColor ? "rgba(255,255,255,0.7)" : "#78716c";
      ctx.font = `italic 22px 'Noto Sans SC', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(pinyin, canvas.width / 2, canvas.height / 2 + 55);
      // Flowing underline
      ctx.strokeStyle = signatureColor ? "rgba(255,255,255,0.4)" : "#d6d3d1";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, canvas.height / 2 + 72);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2 + 80, canvas.width / 2 + 120, canvas.height / 2 + 72);
      ctx.stroke();

    } else if (selectedStyle === "formal") {
      // 正式 - upright, bold, centered, no decoration
      ctx.fillStyle = signatureColor || "#0f0f0f";
      ctx.font = `700 76px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = signatureColor ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
      // Formal border lines
      ctx.strokeStyle = signatureColor ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 160, canvas.height / 2 - 65);
      ctx.lineTo(canvas.width / 2 + 160, canvas.height / 2 - 65);
      ctx.moveTo(canvas.width / 2 - 160, canvas.height / 2 + 65);
      ctx.lineTo(canvas.width / 2 + 160, canvas.height / 2 + 65);
      ctx.stroke();

    } else if (selectedStyle === "artistic1") {
      // 艺术签名1 - 飘逸行书风：墨蓝色、字间连贯、每字微倾、落款线+印章
      ctx.save();
      const chars = displayText.split('');
      const spacing = 88;
      const totalW = chars.length * spacing;
      const startX = canvas.width / 2 - totalW / 2 + spacing / 2;
      
      chars.forEach((char, i) => {
        ctx.save();
        const x = startX + i * spacing;
        const y = canvas.height / 2 - 10 + Math.sin(i * 0.7) * 10;
        ctx.translate(x, y);
        ctx.rotate(-0.05 + i * 0.02);
        // Ink glow
        ctx.fillStyle = signatureColor ? "rgba(255,255,255,0.15)" : "rgba(26,40,80,0.18)";
        ctx.font = `400 96px ${style.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 2, 3);
        // Main stroke — ink blue
        ctx.fillStyle = signatureColor || "#1a2850";
        ctx.font = `400 96px ${style.font}`;
        ctx.fillText(char, 0, 0);
        // Fly-white
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillText(char, -1, -2);
        ctx.restore();
        // Connecting stroke between chars
        if (i < chars.length - 1) {
          const nextX = startX + (i + 1) * spacing - spacing / 2;
          ctx.save();
          ctx.strokeStyle = signatureColor ? "rgba(255,255,255,0.2)" : "rgba(26,40,80,0.2)";
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x + 36, y + 20);
          ctx.quadraticCurveTo(x + spacing * 0.5, y + 38, nextX, canvas.height / 2 - 10 + Math.sin((i + 1) * 0.7) * 10 - 20);
          ctx.stroke();
          ctx.restore();
        }
      });
      // Gold underline
      ctx.strokeStyle = signatureColor ? "rgba(255,215,120,0.7)" : "#b8860b";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startX - 40, canvas.height / 2 + 65);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2 + 78, startX + totalW + 20, canvas.height / 2 + 62);
      ctx.stroke();
      // Red seal
      ctx.save();
      ctx.translate(startX + totalW + 55, canvas.height / 2 + 60);
      ctx.rotate(0.1);
      ctx.strokeStyle = "#c41e3a";
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -16, 32, 32);
      ctx.fillStyle = "rgba(196,30,58,0.12)";
      ctx.fillRect(-13,-13,26,26);
      ctx.fillStyle = "#c41e3a";
      ctx.font = "bold 13px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("印", 0, 0);
      ctx.restore();
      ctx.restore();

    } else if (selectedStyle === "artistic2") {
      // 艺术签名2 - 豪放草书风：浓墨、大幅度、波动感强、粗下划线+大印章
      ctx.save();
      const chars = displayText.split('');
      const spacing = 140;
      const totalW = chars.length * spacing;
      // Overall slight lean
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-0.10);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      chars.forEach((char, i) => {
        ctx.save();
        const x = canvas.width / 2 - totalW / 2 + spacing / 2 + i * spacing;
        const y = canvas.height / 2 - 20 + Math.sin(i * 1.4) * 28;
        const charRot = -0.20 + i * 0.18 + Math.sin(i) * 0.12;
        const scl = 0.95 + Math.sin(i * 0.8) * 0.12;
        ctx.translate(x, y);
        ctx.rotate(charRot);
        ctx.scale(scl, scl);
        // Shadow ink splash
        ctx.fillStyle = "rgba(10,5,0,0.18)";
        ctx.font = `900 130px ${style.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 8, 8);
        ctx.fillStyle = "rgba(10,5,0,0.30)";
        ctx.font = `900 120px ${style.font}`;
        ctx.fillText(char, 4, 4);
        // Main - deep black
        ctx.fillStyle = signatureColor || "#080300";
        ctx.font = `900 112px ${style.font}`;
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });
      ctx.restore();
      // Bold wavy underline
      ctx.save();
      ctx.strokeStyle = signatureColor ? "rgba(255,80,80,0.7)" : "#8b0000";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      const ulStartX = canvas.width / 2 - totalW * 0.55;
      const ulY = canvas.height / 2 + 100;
      ctx.moveTo(ulStartX, ulY);
      for (let i = 0; i <= 10; i++) {
        ctx.lineTo(ulStartX + i * (totalW * 1.1 / 10), ulY + Math.sin(i * 0.9) * 22 + i * 1.5);
      }
      ctx.stroke();
      ctx.restore();
      // Big red seal
      ctx.save();
      ctx.translate(canvas.width / 2 + totalW * 0.6, canvas.height / 2 + 90);
      ctx.rotate(-0.12);
      ctx.strokeStyle = "#b22222";
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-28,-28,56,56);
      ctx.fillStyle = "rgba(178,34,34,0.18)";
      ctx.fillRect(-24,-24,48,48);
      ctx.fillStyle = "#8b0000";
      ctx.font = "bold 22px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("名", 0, 0);
      ctx.restore();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `signature-${characters}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
  };

  if (isLocked) {
    return (
      <Card className="p-6 bg-stone-50 border-stone-200">
        <div className="text-center py-8">
          <PenTool className="w-12 h-12 mx-auto mb-4 text-stone-400" />
          <h3 className="text-lg font-semibold text-stone-700 mb-2">Signature Designer</h3>
          <p className="text-sm text-stone-500 mb-4">Unlock Pro to design your personal signature</p>
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
        <PenTool className="w-5 h-5 text-amber-600" />
        Signature Designer
      </h3>

      {/* Style Selector */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {(Object.keys(SIGNATURE_STYLES) as SignatureStyle[]).map((style) => (
          <Button
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            className={`h-auto py-3 px-2 ${selectedStyle === style ? "bg-stone-800" : ""}`}
            onClick={() => setSelectedStyle(style)}
          >
            <div className="text-center">
              <div className="font-semibold text-sm">{SIGNATURE_STYLES[style].name}</div>
              <div className="text-xs opacity-70 mt-1">{SIGNATURE_STYLES[style].desc}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Custom Text */}
      <div className="mb-4">
        <Label className="text-sm text-stone-600">Custom Text (optional)</Label>
        <Input
          placeholder="Enter custom text for signature"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          className="mt-1 border-stone-300"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <Label className="text-sm text-stone-600 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Upload Photo/Pattern
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1 border-stone-300"
          />
          {uploadedImage && (
            <Button variant="outline" size="icon" onClick={handleClearImage}>
              <Eraser className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1">Upload a photo or pattern to combine with your signature</p>
      </div>

      {/* Canvas Preview */}
      <div className="relative bg-stone-50 rounded-lg overflow-hidden mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      {/* Download */}
      <Button
        className="w-full bg-red-800 hover:bg-red-900 text-white"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-2" />
        {downloaded ? "Downloaded!" : "Download Signature"}
      </Button>
    </Card>
  );
}

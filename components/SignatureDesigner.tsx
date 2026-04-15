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

const SIGNATURE_STYLES: Record<SignatureStyle, { name: string; desc: string; font: string }> = {
  cursive: {
    name: "飘逸签名 Cursive",
    desc: "行云流水，个性十足 · Flowing & Personal",
    font: "'KaiTi', 'STKaiti', '楷体', cursive",
  },
  formal: {
    name: "正式签名 Formal",
    desc: "端正稳重，商务首选 · Professional & Elegant",
    font: "'FangSong', 'STFangsong', '仿宋', serif",
  },
  artistic1: {
    name: "王羲之风格 Wang Xizhi",
    desc: "飘逸典雅，行云流水 · Elegant & Graceful",
    font: "'LiSu', 'LiShu', '隶书', cursive",
  },
  artistic2: {
    name: "毛泽东风格 Mao Zedong",
    desc: "豪放洒脱，大气磅礴 · Bold & Powerful",
    font: "'YouYuan', 'STYuanti', '幼圆', cursive",
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

    // Background - clean white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const style = SIGNATURE_STYLES[selectedStyle];
    const displayText = customText || characters;

    // Draw signature in different styles based on selection
    ctx.save();

    if (selectedStyle === "cursive") {
      // Cursive style - flowing
      ctx.fillStyle = "#1c1917";
      ctx.font = `bold 72px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Add slight rotation for flow effect
      ctx.translate(canvas.width / 2, canvas.height / 2 - 30);
      ctx.rotate(-0.05);
      ctx.fillText(displayText, 0, 0);
      ctx.restore();

      // Pinyin underneath
      ctx.fillStyle = "#78716c";
      ctx.font = "italic 24px 'Noto Sans SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pinyin, canvas.width / 2, canvas.height / 2 + 50);

      // Decorative line
      ctx.strokeStyle = "#d6d3d1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2 + 70);
      ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2 + 70);
      ctx.stroke();

    } else if (selectedStyle === "formal") {
      // Formal style - clean and centered, NO pinyin
      ctx.fillStyle = "#1c1917";
      ctx.font = `bold 64px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

    } else if (selectedStyle === "artistic1") {
      // Artistic 1 - Wang Xizhi style: flowing, elegant, graceful strokes
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
      
      // Soft diagonal rotation for flowing feel
      ctx.rotate(-0.06);
      
      // Elegant ink color - deep blue-black like traditional ink
      ctx.fillStyle = "#1a365d";
      ctx.font = `bold 85px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Soft shadow for depth
      ctx.shadowColor = "rgba(26, 54, 93, 0.2)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(displayText, 0, 0);
      ctx.restore();

      // Elegant flowing underline - like a brush stroke
      ctx.strokeStyle = "#c4a35a";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 140, canvas.height / 2 + 55);
      ctx.quadraticCurveTo(canvas.width / 2 - 40, canvas.height / 2 + 65, canvas.width / 2 + 40, canvas.height / 2 + 55);
      ctx.quadraticCurveTo(canvas.width / 2 + 100, canvas.height / 2 + 45, canvas.width / 2 + 160, canvas.height / 2 + 50);
      ctx.stroke();

      // Small decorative dot - like a seal stamp
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 180, canvas.height / 2 + 48, 6, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle red seal stamp
      ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
      ctx.fillRect(canvas.width / 2 + 165, canvas.height / 2 + 33, 30, 30);

    } else if (selectedStyle === "artistic2") {
      // Artistic 2 - Mao Zedong style: wild, bold, powerful strokes
      ctx.save();
      ctx.translate(canvas.width / 2 - 30, canvas.height / 2);
      
      // Aggressive rotation for wild, dynamic effect
      ctx.rotate(-0.25);
      
      // Multiple layers for bold, powerful effect
      // Outer glow layer
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      // Bold black strokes with red accent outline
      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 4;
      ctx.font = `900 100px ${style.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(displayText, 2, 2);
      
      // Main powerful text - deep black
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#0c0a09";
      ctx.fillText(displayText, 0, 0);
      ctx.restore();

      // Second layer - offset for dramatic overlapping effect
      ctx.save();
      ctx.translate(canvas.width / 2 + 40, canvas.height / 2 - 15);
      ctx.rotate(0.2);
      ctx.fillStyle = "#374151";
      ctx.font = `bold 80px ${style.font}`;
      ctx.globalAlpha = 0.4;
      ctx.fillText(displayText, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;

      // Bold wild underline strokes - dramatic sweeps
      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 220, canvas.height / 2 + 85);
      ctx.quadraticCurveTo(canvas.width / 2 - 80, canvas.height / 2 + 120, canvas.width / 2 + 60, canvas.height / 2 + 75);
      ctx.quadraticCurveTo(canvas.width / 2 + 160, canvas.height / 2 + 45, canvas.width / 2 + 240, canvas.height / 2 + 95);
      ctx.stroke();

      // Heavy accent underline - solid and powerful
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 200, canvas.height / 2 + 105);
      ctx.lineTo(canvas.width / 2 + 220, canvas.height / 2 + 105);
      ctx.stroke();

      // Red seal stamp - authentic Chinese style
      ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
      ctx.fillRect(canvas.width / 2 + 200, canvas.height / 2 + 60, 35, 35);
      ctx.fillStyle = "#fafaf9";
      ctx.font = "bold 16px serif";
      ctx.fillText("印", canvas.width / 2 + 217, canvas.height / 2 + 82);
    }

    // Draw uploaded image if exists
    if (uploadedImage) {
      const imgWidth = uploadedImage.width * imagePosition.scale;
      const imgHeight = uploadedImage.height * imagePosition.scale;
      const imgX = canvas.width * imagePosition.x - imgWidth / 2;
      const imgY = canvas.height * imagePosition.y - imgHeight / 2;

      // Add subtle shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);
      ctx.shadowColor = "transparent";
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
      <div className="grid grid-cols-3 gap-3 mb-4">
        {(Object.keys(SIGNATURE_STYLES) as SignatureStyle[]).map((style) => (
          <Button
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            className={`h-auto py-3 ${selectedStyle === style ? "bg-stone-800" : ""}`}
            onClick={() => setSelectedStyle(style)}
          >
            <div className="text-center">
              <div className="font-semibold">{SIGNATURE_STYLES[style].name}</div>
              <div className="text-xs opacity-70">{SIGNATURE_STYLES[style].desc}</div>
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

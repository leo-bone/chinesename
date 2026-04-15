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
      // 王羲之风格 - 行书：飘逸流畅、笔势连贯、行云流水
      ctx.save();
      
      // 宣纸背景
      ctx.fillStyle = "#faf8f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 纹理
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(139, 125, 107, ${Math.random() * 0.02})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      
      const chars = displayText.split('');
      const startX = canvas.width / 2 - (chars.length * 80) / 2;
      
      // 绘制每个字 - 行书连笔效果
      chars.forEach((char, i) => {
        ctx.save();
        const x = startX + i * 85 + 40;
        const y = canvas.height / 2 - 15 + Math.sin(i * 0.6) * 12;
        
        // 轻微倾斜，连贯感
        const rotation = -0.06 + i * 0.015;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // 行书笔触 - 浓淡变化
        // 外晕
        ctx.fillStyle = "rgba(30, 40, 60, 0.2)";
        ctx.font = "bold 100px 'KaiTi', 'STKaiti', '楷体', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 2, 2);
        
        // 主笔 - 墨黑
        ctx.fillStyle = "#1a1a2e";
        ctx.font = "bold 100px 'KaiTi', 'STKaiti', '楷体', serif";
        ctx.fillText(char, 0, 0);
        
        // 飞白
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillText(char, -1, -2);
        
        ctx.restore();
        
        // 连笔游丝 - 字间连贯
        if (i < chars.length - 1) {
          ctx.strokeStyle = "rgba(26, 26, 46, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const startX_pos = x + 35;
          const endX_pos = startX + (i + 1) * 85 + 5;
          ctx.moveTo(startX_pos, y + Math.random() * 20 - 10);
          ctx.quadraticCurveTo(
            (startX_pos + endX_pos) / 2, 
            y + 25 + Math.sin(i) * 15,
            endX_pos, 
            canvas.height / 2 - 15 + Math.sin((i + 1) * 0.6) * 12
          );
          ctx.stroke();
        }
      });
      
      // 落款线 - 流畅
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 130, canvas.height / 2 + 65);
      ctx.quadraticCurveTo(canvas.width / 2 - 40, canvas.height / 2 + 75, canvas.width / 2 + 40, canvas.height / 2 + 68);
      ctx.quadraticCurveTo(canvas.width / 2 + 100, canvas.height / 2 + 60, canvas.width / 2 + 160, canvas.height / 2 + 72);
      ctx.stroke();
      
      // 印章
      ctx.save();
      ctx.translate(canvas.width / 2 + 185, canvas.height / 2 + 62);
      ctx.rotate(0.08);
      ctx.strokeStyle = "#c41e3a";
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -16, 32, 32);
      ctx.fillStyle = "rgba(196, 30, 58, 0.15)";
      ctx.fillRect(-13, -13, 26, 26);
      ctx.fillStyle = "#c41e3a";
      ctx.font = "bold 12px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("书", 0, 0);
      ctx.restore();
      
      ctx.restore();

    } else if (selectedStyle === "artistic2") {
      // 毛泽东风格 - 狂草：豪放磅礴、龙飞凤舞
      ctx.save();
      
      // 米黄宣纸
      ctx.fillStyle = "#f5f0e6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 岁月痕迹
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(139, 90, 43, ${Math.random() * 0.015})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 4, 1);
      }
      
      const chars = displayText.split('');
      
      // 整体左倾 - 毛体特征
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-0.22);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      chars.forEach((char, i) => {
        ctx.save();
        
        // 大幅波动
        const x = canvas.width / 2 - 120 + i * 130;
        const y = canvas.height / 2 + Math.sin(i * 1.5) * 50 - 30;
        
        // 大幅旋转
        const charRotation = -0.35 + i * 0.2 + Math.cos(i) * 0.25;
        
        ctx.translate(x, y);
        ctx.rotate(charRotation);
        
        // 大小变化
        const scale = 1.1 + Math.sin(i * 0.9) * 0.2;
        ctx.scale(scale, scale);
        
        // 泼墨效果 - 多层
        ctx.fillStyle = "rgba(40, 10, 5, 0.12)";
        ctx.font = "900 160px 'KaiTi', 'STKaiti', '楷体', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 10, 10);
        
        ctx.fillStyle = "rgba(30, 8, 4, 0.25)";
        ctx.font = "900 145px 'KaiTi', serif";
        ctx.fillText(char, 5, 5);
        
        // 主笔 - 浓墨
        ctx.fillStyle = "#0f0505";
        ctx.font = "900 135px 'KaiTi', serif";
        ctx.fillText(char, 0, 0);
        
        // 红色点缀
        ctx.fillStyle = "rgba(160, 20, 20, 0.4)";
        ctx.fillText(char, 1, 0);
        
        ctx.restore();
      });
      
      ctx.restore();
      
      // 狂草下划线 - 大幅波浪
      ctx.save();
      ctx.strokeStyle = "#8b0000";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 280, canvas.height / 2 + 110);
      
      for (let i = 0; i <= 12; i++) {
        const x = canvas.width / 2 - 280 + i * 45;
        const y = canvas.height / 2 + 110 + Math.sin(i * 0.9) * 40 + i * 2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // 加粗强调
      ctx.strokeStyle = "#4a0000";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, canvas.height / 2 + 130);
      ctx.quadraticCurveTo(canvas.width / 2 + 20, canvas.height / 2 + 170, canvas.width / 2 + 140, canvas.height / 2 + 120);
      ctx.stroke();
      ctx.restore();
      
      // 大印章
      ctx.save();
      ctx.translate(canvas.width / 2 + 240, canvas.height / 2 + 110);
      ctx.rotate(-0.15);
      ctx.strokeStyle = "#b22222";
      ctx.lineWidth = 4;
      ctx.strokeRect(-28, -28, 56, 56);
      ctx.fillStyle = "rgba(178, 34, 34, 0.2)";
      ctx.fillRect(-24, -24, 48, 48);
      ctx.fillStyle = "#8b0000";
      ctx.font = "bold 24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("毛", 0, 0);
      ctx.restore();
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

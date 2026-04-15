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
      // 王羲之风格 - 真正的行书效果：飘逸流畅、笔势连贯、行云流水
      ctx.save();
      
      // 绘制背景宣纸纹理
      ctx.fillStyle = "#faf8f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 添加细微纹理
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = `rgba(139, 125, 107, ${Math.random() * 0.03})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      
      const chars = displayText.split('');
      const startX = canvas.width / 2 - (chars.length * 70) / 2;
      
      chars.forEach((char, i) => {
        ctx.save();
        const x = startX + i * 75 + 35;
        const y = canvas.height / 2 - 10 + Math.sin(i * 0.5) * 8;
        
        // 每个字略微不同的倾斜，模拟行书连贯感
        const rotation = -0.08 + i * 0.02 + Math.sin(i) * 0.03;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // 绘制毛笔笔触效果 - 多层叠加创造飞白感
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 50);
        gradient.addColorStop(0, "#0d1b2a");
        gradient.addColorStop(0.7, "#1b263b");
        gradient.addColorStop(1, "#415a77");
        
        // 外层淡墨晕染
        ctx.fillStyle = "rgba(27, 38, 59, 0.3)";
        ctx.font = "bold 95px 'KaiTi', 'STKaiti', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 3, 3);
        
        // 中层浓墨
        ctx.fillStyle = "rgba(13, 27, 42, 0.7)";
        ctx.fillText(char, 1, 1);
        
        // 主笔触 - 深黑带蓝调
        ctx.fillStyle = gradient;
        ctx.fillText(char, 0, 0);
        
        // 飞白效果 - 模拟毛笔干墨
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "bold 95px 'KaiTi', serif";
        ctx.fillText(char, -2, -2);
        
        ctx.restore();
      });
      
      // 绘制连贯的笔势流动线
      ctx.strokeStyle = "rgba(139, 69, 19, 0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      ctx.moveTo(startX - 20, canvas.height / 2 + 20);
      for (let i = 0; i <= chars.length; i++) {
        ctx.quadraticCurveTo(
          startX + i * 75, canvas.height / 2 + 25 + Math.sin(i) * 10,
          startX + i * 75 + 35, canvas.height / 2 + 20
        );
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 优雅的落款线
      ctx.strokeStyle = "#8b6914";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, canvas.height / 2 + 70);
      ctx.quadraticCurveTo(canvas.width / 2 - 30, canvas.height / 2 + 80, canvas.width / 2 + 30, canvas.height / 2 + 72);
      ctx.quadraticCurveTo(canvas.width / 2 + 90, canvas.height / 2 + 65, canvas.width / 2 + 150, canvas.height / 2 + 75);
      ctx.stroke();
      
      // 印章 - 古朴红色
      ctx.save();
      ctx.translate(canvas.width / 2 + 170, canvas.height / 2 + 65);
      ctx.rotate(0.05);
      
      // 印章边框
      ctx.strokeStyle = "#c41e3a";
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, -18, 36, 36);
      
      // 印章底色
      ctx.fillStyle = "rgba(196, 30, 58, 0.2)";
      ctx.fillRect(-15, -15, 30, 30);
      
      // 印文
      ctx.fillStyle = "#c41e3a";
      ctx.font = "bold 14px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("书", 0, 0);
      ctx.restore();
      
      ctx.restore();

    } else if (selectedStyle === "artistic2") {
      // 毛泽东风格 - 真正的毛体效果：豪放磅礴、龙飞凤舞、气吞山河
      ctx.save();
      
      // 绘制背景 - 米黄色宣纸
      ctx.fillStyle = "#f5f0e6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 添加岁月痕迹纹理
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(139, 90, 43, ${Math.random() * 0.02})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 1);
      }
      
      const chars = displayText.split('');
      
      // 整体大幅倾斜 - 毛体特征
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-0.18);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      chars.forEach((char, i) => {
        ctx.save();
        
        // 大幅波动的位置 - 龙飞凤舞
        const x = canvas.width / 2 - 100 + i * 110;
        const y = canvas.height / 2 + Math.sin(i * 1.2) * 40 - 20;
        
        // 每个字大幅旋转，形成奔放感
        const charRotation = -0.3 + i * 0.15 + Math.cos(i) * 0.2;
        
        ctx.translate(x, y);
        ctx.rotate(charRotation);
        
        // 缩放变化 - 有张有弛
        const scale = 1 + Math.sin(i * 0.8) * 0.15;
        ctx.scale(scale, scale);
        
        // 绘制多层创造泼墨效果
        
        // 1. 底层泼墨晕染 - 最大最淡
        ctx.fillStyle = "rgba(60, 20, 10, 0.15)";
        ctx.font = "900 140px 'KaiTi', 'STKaiti', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 8, 8);
        
        // 2. 中层浓墨扩散
        ctx.fillStyle = "rgba(40, 15, 5, 0.4)";
        ctx.font = "900 130px 'KaiTi', serif";
        ctx.fillText(char, 4, 4);
        
        // 3. 主笔触 - 深黑带红调
        const mainGradient = ctx.createRadialGradient(-8, -8, 0, 0, 0, 70);
        mainGradient.addColorStop(0, "#1a0505");
        mainGradient.addColorStop(0.6, "#2d0a0a");
        mainGradient.addColorStop(1, "#4a1515");
        
        ctx.fillStyle = mainGradient;
        ctx.font = "900 120px 'KaiTi', serif";
        ctx.fillText(char, 0, 0);
        
        // 4. 高光飞白 - 模拟干笔
        ctx.fillStyle = "rgba(200, 180, 160, 0.2)";
        ctx.font = "900 120px 'KaiTi', serif";
        ctx.fillText(char, -5, -5);
        
        // 5. 红色点缀 - 毛体特征
        ctx.fillStyle = "rgba(180, 30, 30, 0.3)";
        ctx.font = "900 120px 'KaiTi', serif";
        ctx.fillText(char, 2, 0);
        
        ctx.restore();
      });
      
      ctx.restore(); // 恢复整体旋转
      
      // 绘制狂草风格的波浪下划线
      ctx.save();
      ctx.strokeStyle = "#8b0000";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 250, canvas.height / 2 + 100);
      
      // 大幅波动的曲线
      for (let i = 0; i <= 10; i++) {
        const x = canvas.width / 2 - 250 + i * 50;
        const y = canvas.height / 2 + 100 + Math.sin(i * 0.8) * 30 + i * 3;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // 加粗强调部分
      ctx.strokeStyle = "#4a0000";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2 + 115);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2 + 140, canvas.width / 2 + 100, canvas.height / 2 + 110);
      ctx.stroke();
      ctx.restore();
      
      // 毛泽东风格印章 - 大而醒目
      ctx.save();
      ctx.translate(canvas.width / 2 + 220, canvas.height / 2 + 90);
      ctx.rotate(-0.1);
      
      // 印章外框
      ctx.strokeStyle = "#b22222";
      ctx.lineWidth = 3;
      ctx.strokeRect(-25, -25, 50, 50);
      
      // 印章填充
      ctx.fillStyle = "rgba(178, 34, 34, 0.25)";
      ctx.fillRect(-22, -22, 44, 44);
      
      // 印文 - 毛
      ctx.fillStyle = "#8b0000";
      ctx.font = "bold 22px serif";
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

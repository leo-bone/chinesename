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

    // Header decoration - Bilingual
    ctx.fillStyle = "#92400e";
    ctx.font = "bold 28px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText("Chinese Name Certificate · 姓名证书", width / 2, 100);

    // Decorative line
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 130);
    ctx.lineTo(width - 250, 130);
    ctx.stroke();

    // Small decorative circles
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(250, 130, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 250, 130, 6, 0, Math.PI * 2);
    ctx.fill();

    // "Certificate of Name" label - Bilingual
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 42px 'Noto Serif SC', serif";
    ctx.fillText("姓名证书 Name Certificate", width / 2, 200);

    // Recipient - Bilingual
    ctx.fillStyle = "#451a03";
    ctx.font = "24px 'Noto Sans SC', sans-serif";
    ctx.fillText(`授予 Awarded to: ${formData.englishName}`, width / 2, 270);

    // Main name - large calligraphy
    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 180px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText(name.characters, width / 2, 460);

    // Pinyin
    ctx.fillStyle = "#78716c";
    ctx.font = "italic 32px 'Noto Sans SC', sans-serif";
    ctx.fillText(name.pinyin, width / 2, 510);

    // Meaning section - Bilingual
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.textAlign = "left";
    ctx.fillText("名字寓意 Meaning", 120, 600);

    ctx.fillStyle = "#1c1917";
    ctx.font = "22px 'Noto Sans SC', sans-serif";
    const meaningLines = wrapText(ctx, name.meaning, width - 260);
    meaningLines.forEach((line, i) => {
      ctx.fillText(line, 120, 640 + i * 32);
    });

    // Story section - Bilingual with real story
    const sourceStartY = 640 + meaningLines.length * 32 + 30;
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.fillText("名字故事 Name Story", 120, sourceStartY);

    // Generate a real story based on the name
    const story = generateNameStory(name.characters, name.pinyin, name.meaning);
    
    ctx.fillStyle = "#44403c";
    ctx.font = "18px 'Noto Serif SC', serif";
    const storyLines = wrapText(ctx, story, width - 260);
    storyLines.forEach((line, i) => {
      ctx.fillText(line, 120, sourceStartY + 40 + i * 28);
    });

    // Personality match - Bilingual
    const matchStartY = sourceStartY + 40 + storyLines.length * 28 + 30;
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 24px 'Noto Serif SC', serif";
    ctx.fillText("与您的契合 Why It Fits", 120, matchStartY);

    ctx.fillStyle = "#44403c";
    ctx.font = "20px 'Noto Sans SC', sans-serif";
    const matchLines = wrapText(ctx, name.personalityMatch, width - 260);
    matchLines.forEach((line, i) => {
      ctx.fillText(line, 120, matchStartY + 40 + i * 30);
    });

    // Footer decoration
    const footerY = Math.max(matchStartY + 40 + matchLines.length * 30 + 60, 1200);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, footerY);
    ctx.lineTo(width - 150, footerY);
    ctx.stroke();

    // Info row - Bilingual
    ctx.fillStyle = "#78716c";
    ctx.font = "16px 'Noto Sans SC', sans-serif";
    ctx.textAlign = "center";
    const genderText = formData.gender === 'male' ? '男 Male' : formData.gender === 'female' ? '女 Female' : '中性 Neutral';
    ctx.fillText(`性别 Gender: ${genderText}  |  年龄 Age: ${formData.age}  |  性格 Personality: ${getPersonalityLabel(formData.personality)}`, width / 2, footerY + 35);

    // Website
    ctx.fillStyle = "#92400e";
    ctx.font = "18px 'Noto Sans SC', sans-serif";
    ctx.fillText("chinesename.uichain.org", width / 2, footerY + 70);

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

  // Generate a meaningful story for the name
  const generateNameStory = (characters: string, pinyin: string, meaning: string): string => {
    const stories: Record<string, string> = {
      "子轩": "子，取自《论语》「君子务本」，喻君子之德；轩，出自《楚辞》「轩翥而翔飞」，喻气宇轩昂。此名承载千年儒家文化，寓意君子风度、志向高远。",
      "浩然": "出自《孟子·公孙丑上》「吾善养吾浩然之气」，浩然之气指正大刚直的精神。此名寓意胸怀坦荡、正气凛然，是中国文人追求的至高境界。",
      "睿渊": "睿，明智也，出自《尚书》「睿作圣」；渊，深也，出自《诗经》「秉心塞渊」。二字合璧，喻智慧深邃如渊，是魏晋名士推崇的品格。",
      "文博": "文，文采也，出自《论语》「文质彬彬」；博，广博也，出自《荀子》「君子博学」。此名体现中国传统文化对学识修养的重视。",
      "俊熙": "俊，才俊也，出自《荀子》「天下俊」；熙，光明也，出自《诗经》「维清缉熙」。寓意才貌出众、前程光明。",
      "泽楷": "泽，恩泽也，出自《孟子》「膏泽下于民」；楷，楷模也，出自《后汉书》。寓意施恩于人、堪为模范，体现儒家济世情怀。",
      "明辉": "出自唐代李白《把酒问月》「皎如飞镜临丹阙，绿烟灭尽清辉发」。明辉即明亮的光辉，寓意才华出众、光芒四射。",
      "修杰": "修，修身也，出自《大学》「修身齐家」；杰，俊杰也，出自《孟子》。寓意修身立德、成为人中豪杰。",
      "诗涵": "诗，诗经也，中国第一部诗歌总集；涵，涵养也，出自《诗经》「涵泳其中」。此名寓意腹有诗书、气质如兰，是书香门第的首选。",
      "雅琪": "雅，高雅也，出自《诗经》「雅者，正也」；琪，美玉也，出自《山海经》。寓意高雅如玉、温润而泽。",
      "梦琪": "梦，梦想也，出自《庄子》「庄周梦蝶」；琪，美玉也。此名融合道家浪漫与儒家温润，寓意美梦成真、珍贵如玉。",
      "雨萱": "雨，甘霖也，出自《诗经》「雨雪霏霏」；萱，萱草也，古称忘忧草。寓意如春雨般滋润、带来欢乐无忧。",
      "欣怡": "欣，喜悦也，出自《诗经》「旨酒欣欣」；怡，和悦也，出自《论语》「怡然自得」。寓意欢欣喜悦、怡然自乐。",
      "思颖": "思，思考也，出自《论语》「学而不思则罔」；颖，聪颖也，出自《史记》。寓意聪慧善思、才思敏捷。",
      "佳怡": "佳，美好也，出自《楚辞》；怡，愉悦也。寓意美好愉悦、令人赏心悦目。",
      "若曦": "若，如也，出自《诗经》；曦，晨光也，出自《聊斋志异》。寓意如清晨第一缕阳光，温暖而充满希望。",
      "文轩": "文，文采也；轩，高扬也，出自《楚辞》「轩翥而翔飞」。寓意文采飞扬、气宇不凡。",
      "明远": "出自诸葛亮《诫子书》「非淡泊无以明志，非宁静无以致远」。寓意志向远大、目光长远。",
      "思远": "出自《诗经》「视尔不藏，我思不远」。寓意思虑深远、志存高远。",
      "清扬": "出自《诗经·郑风》「有美一人，清扬婉兮」。形容眉目清秀、神采飞扬。",
      "云帆": "出自李白《行路难》「长风破浪会有时，直挂云帆济沧海」。寓意乘风破浪、勇往直前。",
      "景行": "出自《诗经》「高山仰止，景行行止」，意为大道、崇高的品德。寓意德行高尚、令人敬仰。",
    };
    
    // Return specific story if exists, otherwise generate generic
    if (stories[characters]) {
      return stories[characters];
    }
    
    // Generic story based on meaning
    return `此名寓意${meaning}，融合中国传统文化精髓。每个汉字都承载着千年文化积淀，既有古典韵味，又具现代气息，是为您的独特气质量身定制的佳名。`;
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

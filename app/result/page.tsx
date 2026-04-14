"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Share2, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ChineseName {
  characters: string;
  pinyin: string;
  meaning: string;
  culturalSignificance: string;
  personalityMatch: string;
}

interface FormData {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
  desiredMeaning: string;
}

export default function ResultPage() {
  const [names, setNames] = useState<ChineseName[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("chineseNameForm");
    if (stored) {
      const data = JSON.parse(stored);
      setFormData(data);
      generateNames(data);
    } else {
      setError("No form data found. Please go back and fill out the form.");
      setIsLoading(false);
    }
  }, []);

  // Draw calligraphy when names are loaded
  useEffect(() => {
    if (names.length > 0) {
      names.forEach((name, index) => {
        drawCalligraphy(name.characters, index);
      });
    }
  }, [names]);

  const drawCalligraphy = (characters: string, index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas
    ctx.fillStyle = "#fafaf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid lines (rice paper style)
    ctx.strokeStyle = "#e7e5e4";
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += canvas.width / 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += canvas.height / 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw characters
    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 80px 'Noto Serif SC', 'SimSun', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Add shadow for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Draw each character
    const charArray = characters.split("");
    const startX = canvas.width / 2 - ((charArray.length - 1) * 50);
    charArray.forEach((char, i) => {
      ctx.fillText(char, startX + i * 100, canvas.height / 2);
    });

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw red seal (chop) in corner
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(canvas.width - 60, canvas.height - 60, 40, 40);
    ctx.fillStyle = "#fafaf9";
    ctx.font = "12px serif";
    ctx.fillText("吉", canvas.width - 40, canvas.height - 40);
  };

  const generateNames = async (data: FormData) => {
    try {
      // Call DeepSeek API to generate names
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate names");
      }

      const result = await response.json();
      setNames(result.names);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating names:", err);
      setError("Failed to generate names. Please check your API key and try again.");
      setIsLoading(false);
    }
  };



  const handleDownload = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `chinese-name-${index + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-red-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Creating Your Chinese Names...</h2>
          <p className="text-stone-600">Our AI is carefully crafting personalized names based on your unique traits</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Oops!</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-red-800 hover:bg-red-900 text-white">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">
          Your Chinese Names
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Here are {names.length} personalized Chinese names crafted just for you, {formData?.englishName}
        </p>
      </div>

      {/* Names Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {names.map((name, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-stone-200 shadow-lg overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-stone-500">Option {index + 1}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(index)}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Calligraphy Canvas */}
              <div className="relative bg-stone-100 rounded-lg overflow-hidden">
                <canvas
                  ref={(el) => { canvasRefs.current[index] = el; }}
                  className="w-full h-auto"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>

              {/* Name Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-3xl font-bold text-stone-800">{name.characters}</h3>
                  <p className="text-lg text-red-700 font-medium">{name.pinyin}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-stone-700">Meaning: </span>
                    <span className="text-stone-600">{name.meaning}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Cultural Significance: </span>
                    <span className="text-stone-600">{name.culturalSignificance}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Why It Fits You: </span>
                    <span className="text-stone-600">{name.personalityMatch}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="border-stone-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Names
            </Button>
          </Link>
          <Button className="bg-red-800 hover:bg-red-900 text-white">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
        <p className="text-stone-500 text-sm">
          Want more personalized names? Upgrade to Premium for $9.99
        </p>
      </div>
    </div>
  );
}

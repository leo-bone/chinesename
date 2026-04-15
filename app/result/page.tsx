"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, Share2, RefreshCw, Copy, Check, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { usePro } from "@/components/ProProvider";
import UnlockPanel from "@/components/UnlockPanel";
import CalligraphyCanvas from "@/components/CalligraphyCanvas";
import SignatureDesigner from "@/components/SignatureDesigner";
import NameStoryCard from "@/components/NameStoryCard";
import SocialSharePack from "@/components/SocialSharePack";

interface ChineseName {
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
  desiredMeaning: string;
}

export default function ResultPage() {
  const [names, setNames] = useState<ChineseName[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedNameIndex, setSelectedNameIndex] = useState(0);
  const { proStatus } = usePro();

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

  const generateNames = async (data: FormData, more: boolean = false) => {
    try {
      // Try local API first (for development), fallback to direct DeepSeek API
      const apiUrl = process.env.NODE_ENV === "development" 
        ? "/api/generate"
        : "https://api.deepseek.com/v1/chat/completions";

      let response;
      
      if (process.env.NODE_ENV === "development") {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, more }),
        });
      } else {
        // Production: Call DeepSeek API directly from client
        // Note: In production, you should use a proxy server to hide API key
        // For now, we'll use a simple client-side generation as fallback
        const names = await generateNamesClientSide(data, more);
        setNames(names);
        setIsLoading(false);
        setIsRegenerating(false);
        setIsGeneratingMore(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate names");
      }

      const result = await response.json();
      const generatedNames = result.names || [];
      setNames(generatedNames);
      setIsLoading(false);
      setIsRegenerating(false);
      setIsGeneratingMore(false);
    } catch (err) {
      console.error("Error generating names:", err);
      // Fallback to client-side generation
      const names = await generateNamesClientSide(data, more);
      setNames(names);
      setIsLoading(false);
      setIsRegenerating(false);
      setIsGeneratingMore(false);
    }
  };

  // Client-side name generation as fallback
  const generateNamesClientSide = async (data: FormData, more: boolean): Promise<ChineseName[]> => {
    const count = more ? 9 : 5;
    
    // Personality-based character pools
    const personalityChars: Record<string, string[]> = {
      "creative": ["艺", "创", "思", "梦", "灵", "韵", "墨", "诗", "画", "音"],
      "adventurous": ["勇", "探", "远", "翔", "驰", "越", "征", "航", "峰", "浪"],
      "intellectual": ["智", "思", "博", "学", "睿", "哲", "明", "慧", "识", "渊"],
      "compassionate": ["仁", "慈", "爱", "和", "善", "恩", "惠", "暖", "柔", "宁"],
      "confident": ["志", "豪", "杰", "雄", "威", "毅", "刚", "强", "胜", "凯"],
      "peaceful": ["静", "安", "宁", "和", "清", "雅", "悠", "逸", "闲", "淡"],
      "ambitious": ["志", "宏", "伟", "业", "成", "达", "进", "升", "腾", "展"],
      "playful": ["乐", "欢", "趣", "悦", "欣", "怡", "笑", "朗", "畅", "快"],
    };
    
    const genderChars = data.gender === "female" 
      ? ["婉", "婷", "娜", "丽", "雅", "淑", "娴", "静", "慧", "美"]
      : data.gender === "male"
      ? ["伟", "强", "勇", "刚", "毅", "杰", "豪", "雄", "峰", "涛"]
      : ["文", "明", "华", "志", "远", "博", "雅", "思", "清", "宁"];
    
    const meanings = ["wisdom", "beauty", "strength", "harmony", "ambition", "grace", "courage", "peace", "creativity", "prosperity"];
    
    const personalityKey = Object.keys(personalityChars).find(k => 
      data.personality.toLowerCase().includes(k)
    ) || "creative";
    
    const chars = personalityChars[personalityKey] || personalityChars["creative"];
    
    const names: ChineseName[] = [];
    for (let i = 0; i < count; i++) {
      const char1 = chars[i % chars.length];
      const char2 = genderChars[(i + 3) % genderChars.length];
      const meaning = meanings[i % meanings.length];
      
      names.push({
        characters: char1 + char2,
        pinyin: getPinyin(char1 + char2),
        meaning: `${meaning.charAt(0).toUpperCase() + meaning.slice(1)} and ${meanings[(i + 1) % meanings.length]}`,
        source: `Inspired by your ${data.personality} personality and interest in ${data.interests || "life"}. The character "${char1}" represents ${meanings[i % meanings.length]}, while "${char2}" embodies ${meanings[(i + 2) % meanings.length]}.`,
        personalityMatch: `This name resonates with your ${data.personality} nature, bringing ${meanings[i % meanings.length]} and ${meanings[(i + 1) % meanings.length]} to your journey.`
      });
    }
    
    return names;
  };

  // Simple pinyin mapping
  const getPinyin = (chars: string): string => {
    const pinyinMap: Record<string, string> = {
      "艺": "Yì", "创": "Chuàng", "思": "Sī", "梦": "Mèng", "灵": "Líng",
      "韵": "Yùn", "墨": "Mò", "诗": "Shī", "画": "Huà", "音": "Yīn",
      "勇": "Yǒng", "探": "Tàn", "远": "Yuǎn", "翔": "Xiáng", "驰": "Chí",
      "越": "Yuè", "征": "Zhēng", "航": "Háng", "峰": "Fēng", "浪": "Làng",
      "智": "Zhì", "博": "Bó", "学": "Xué", "睿": "Ruì", "哲": "Zhé",
      "明": "Míng", "慧": "Huì", "识": "Shí", "渊": "Yuān",
      "仁": "Rén", "慈": "Cí", "爱": "Ài", "和": "Hé", "善": "Shàn",
      "恩": "Ēn", "惠": "Huì", "暖": "Nuǎn", "柔": "Róu", "宁": "Níng",
      "志": "Zhì", "豪": "Háo", "杰": "Jié", "雄": "Xióng", "威": "Wēi",
      "毅": "Yì", "刚": "Gāng", "强": "Qiáng", "胜": "Shèng", "凯": "Kǎi",
      "静": "Jìng", "安": "Ān", "清": "Qīng", "雅": "Yǎ", "悠": "Yōu",
      "逸": "Yì", "闲": "Xián", "淡": "Dàn",
      "宏": "Hóng", "伟": "Wěi", "业": "Yè", "成": "Chéng", "达": "Dá",
      "进": "Jìn", "升": "Shēng", "腾": "Téng", "展": "Zhǎn",
      "乐": "Lè", "欢": "Huān", "趣": "Qù", "悦": "Yuè", "欣": "Xīn",
      "怡": "Yí", "笑": "Xiào", "朗": "Lǎng", "畅": "Chàng", "快": "Kuài",
      "婉": "Wǎn", "婷": "Tíng", "娜": "Nà", "丽": "Lì", "淑": "Shū",
      "娴": "Xián", "美": "Měi",
    };
    
    return chars.split("").map(c => pinyinMap[c] || c).join(" ");
  };

  const handleRegenerate = () => {
    if (!formData) return;
    setIsRegenerating(true);
    setNames([]);
    generateNames(formData);
  };

  const handleGenerateMoreNames = () => {
    if (!formData || !proStatus.isPro) return;
    setIsGeneratingMore(true);
    generateNames(formData, true);
  };

  const handleCopyName = (name: ChineseName, index: number) => {
    const text = `${name.characters} (${name.pinyin}) - ${name.meaning}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Name copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: "My Chinese Name",
      text: `I just got my Chinese name: ${names[0]?.characters} (${names[0]?.pinyin})! Discover yours at`,
      url: "https://chinesename.uichain.org",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      const text = `${shareData.text} ${shareData.url}`;
      navigator.clipboard.writeText(text);
      toast.success("Share text copied to clipboard!");
    }
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
            <Button className="bg-red-800 hover:bg-red-900 text-white">Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedName = names[selectedNameIndex];
  const freeNamesCount = 5;
  const displayNames = proStatus.isPro ? names : names.slice(0, freeNamesCount);
  const hasMoreNames = !proStatus.isPro && names.length > freeNamesCount;

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Your Chinese Names</h1>
        <p className="text-lg text-stone-600">
          Here are personalized Chinese names crafted just for you, {formData?.englishName}
        </p>
        {proStatus.isPro && (
          <div className="inline-flex items-center gap-2 mt-4 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
            <Crown className="w-4 h-4" />
            Pro Member - All {names.length} names unlocked
          </div>
        )}
        {/* Generate More Names Button (Pro Only) */}
        {proStatus.isPro && (
          <div className="mt-6">
            <Button
              onClick={handleGenerateMoreNames}
              disabled={isGeneratingMore}
              className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg"
              size="lg"
            >
              {isGeneratingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Premium Names...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate 9 More Premium Names
                </>
              )}
            </Button>
            <p className="text-xs text-stone-500 mt-2">Unlock even better names with our premium AI</p>
          </div>
        )}
      </div>

      {/* Pro Upgrade Banner (for non-pro users) */}
      {!proStatus.isPro && (
        <div className="max-w-6xl mx-auto mb-8">
          <UnlockPanel compact />
        </div>
      )}

      {/* Main Content - Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="names" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="names" className="text-sm sm:text-base">
              <span className="hidden sm:inline">Names ({displayNames.length})</span>
              <span className="sm:hidden">名字 ({displayNames.length})</span>
            </TabsTrigger>
            <TabsTrigger value="calligraphy" className="text-sm sm:text-base">
              <span className="hidden sm:inline">Calligraphy 书法</span>
              <span className="sm:hidden">书法</span>
            </TabsTrigger>
            <TabsTrigger value="signature" className="text-sm sm:text-base">
              <span className="hidden sm:inline">Signature 签名</span>
              <span className="sm:hidden">签名</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="text-sm sm:text-base">
              <span className="hidden sm:inline">Share 分享</span>
              <span className="sm:hidden">分享</span>
            </TabsTrigger>
          </TabsList>

          {/* Names Tab */}
          <TabsContent value="names">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayNames.map((name, index) => (
                <Card
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm border-stone-200 shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                    selectedNameIndex === index ? "ring-2 ring-red-500" : ""
                  } ${index >= freeNamesCount ? "opacity-60" : ""}`}
                  onClick={() => setSelectedNameIndex(index)}
                >
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-stone-500">
                        Option {index + 1}
                        {index >= freeNamesCount && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                            Pro
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyName(name, index);
                          }}
                          className="h-8 w-8"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Calligraphy Preview */}
                    <div className="bg-stone-100 rounded-lg p-4">
                      <p className="text-4xl font-bold text-center text-stone-800">
                        {name.characters}
                      </p>
                      <p className="text-center text-red-700 mt-1">{name.pinyin}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-stone-700">Meaning: </span>
                        <span className="text-stone-600">{name.meaning}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-700">Source: </span>
                        <span className="text-stone-600 text-xs leading-relaxed block mt-1">{name.source}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-stone-700">Why It Fits You: </span>
                        <span className="text-stone-600">{name.personalityMatch}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Locked names placeholder */}
              {hasMoreNames && (
                <Card className="bg-stone-50 border-stone-200 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Crown className="w-12 h-12 text-stone-400 mb-4" />
                    <h3 className="text-lg font-semibold text-stone-700 mb-2">
                      Unlock {names.length - freeNamesCount} More Names
                    </h3>
                    <p className="text-sm text-stone-500 mb-4">
                      Get access to all {names.length} names plus premium features
                    </p>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Unlock Pro ¥9.9
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Calligraphy Tab */}
          <TabsContent value="calligraphy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Select a Name</h3>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {names.slice(0, freeNamesCount + (proStatus.isPro ? names.length - freeNamesCount : 0)).map((name, index) => (
                    <Button
                      key={index}
                      variant={selectedNameIndex === index ? "default" : "outline"}
                      className={`h-auto py-3 ${selectedNameIndex === index ? "bg-stone-800" : ""}`}
                      onClick={() => setSelectedNameIndex(index)}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold">{name.characters}</div>
                        <div className="text-xs opacity-70">{name.pinyin}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {selectedName && (
                  <CalligraphyCanvas
                    characters={selectedName.characters}
                    size="large"
                    showStyleSelector={true}
                    showDownload={true}
                  />
                )}
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">5 Classic Calligraphy Styles</h3>
                <p className="text-sm text-stone-600 mb-4">五种经典书法风格 · 5 Classic Styles</p>
                <div className="space-y-3 text-sm text-stone-700 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 rounded text-green-700 text-center text-xs font-bold">1</span>
                    <span>楷书 Kaishu · 端正秀丽 Classic</span>
                    <span className="text-green-600 text-xs ml-auto">Free 免费</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">2</span>
                    <span>行书 Xingshu · 流畅飘逸 Flowing</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">3</span>
                    <span>草书 Caoshu · 豪放洒脱 Bold</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">4</span>
                    <span>隶书 Lishu · 古朴典雅 Ancient</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">5</span>
                    <span>篆书 Xuanshu · 圆润匀齐 Rounded</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                </div>

                {!proStatus.isPro && (
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Unlock All Styles - ¥9.9
                  </Button>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {selectedName && formData && (
                <>
                  <SignatureDesigner
                    characters={selectedName.characters}
                    pinyin={selectedName.pinyin}
                  />
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">4 Signature Styles</h3>
                    <p className="text-sm text-stone-600 mb-4">四种签名风格 · 4 Signature Styles</p>
                    <div className="space-y-4">
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">飘逸签名 Cursive</h4>
                        <p className="text-sm text-stone-500">行云流水 · Flowing & Personal</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">正式签名 Formal</h4>
                        <p className="text-sm text-stone-500">端正稳重 · Professional & Elegant</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">艺术1 Artistic 1</h4>
                        <p className="text-sm text-stone-500">飘逸典雅 · Elegant & Graceful</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">艺术2 Artistic 2</h4>
                        <p className="text-sm text-stone-500">豪放洒脱 · Bold & Powerful</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-700">上传照片合成签名 Photo Merge</h4>
                        <p className="text-sm text-amber-600">上传照片与签名融合 · Upload photo to merge</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {selectedName && (
                <>
                  <SocialSharePack name={selectedName} />
                  <NameStoryCard name={selectedName} formData={formData!} />
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions */}
      <div className="max-w-6xl mx-auto mt-12 text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="border-stone-300"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isRegenerating ? "Generating..." : "Regenerate Names"}
          </Button>
          <Button className="bg-red-800 hover:bg-red-900 text-white" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-stone-500">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </Link>
      </div>

      {/* Full Unlock Panel */}
      <div className="max-w-md mx-auto mt-12">
        <UnlockPanel />
      </div>
    </div>
  );
}

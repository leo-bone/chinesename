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
    
    // Generate phonetic-based names (1-2 names based on English name sound)
    const phoneticNames = generatePhoneticNames(data.englishName, data.gender);
    
    // Traditional high-quality Chinese names
    const traditionalNames = generateTraditionalNames(data, count - phoneticNames.length);
    
    // Combine: phonetic names first, then traditional
    return [...phoneticNames, ...traditionalNames].slice(0, count);
  };
  
  // Generate phonetic-based names from English name
  const generatePhoneticNames = (englishName: string, gender: string): ChineseName[] => {
    const name = englishName.toLowerCase();
    const phoneticMap: Record<string, ChineseName[]> = {
      // Male names
      "leo": [
        { characters: "李奥", pinyin: "Lǐ Ào", meaning: "Strength and nobility", source: "Phonetic match for Leo · 音译谐音", personalityMatch: "Matches the strong sound of your name" },
        { characters: "立欧", pinyin: "Lì Ōu", meaning: "Stand tall in Europe", source: "Phonetic variation · 音译变体", personalityMatch: "Echoes your name's powerful sound" }
      ],
      "alex": [
        { characters: "艾力", pinyin: "Ài Lì", meaning: "Ivy strength", source: "Phonetic match for Alex · 音译谐音", personalityMatch: "Matches your name's energetic sound" }
      ],
      "david": [
        { characters: "大维", pinyin: "Dà Wéi", meaning: "Great preservation", source: "Phonetic match for David · 音译谐音", personalityMatch: "Honors your name's classic sound" }
      ],
      "michael": [
        { characters: "迈克", pinyin: "Mài Kè", meaning: "Wheat victory", source: "Phonetic match for Michael · 音译谐音", personalityMatch: "Captures your name's strong tone" }
      ],
      "john": [
        { characters: "强", pinyin: "Qiáng", meaning: "Strong", source: "Phonetic match for John · 音译谐音", personalityMatch: "Matches your name's solid sound" }
      ],
      // Female names
      "emma": [
        { characters: "艾玛", pinyin: "Ài Mǎ", meaning: "Ivy agate", source: "Phonetic match for Emma · 音译谐音", personalityMatch: "Matches your name's elegant sound" }
      ],
      "sophia": [
        { characters: "索菲", pinyin: "Suǒ Fēi", meaning: "Search fragrance", source: "Phonetic match for Sophia · 音译谐音", personalityMatch: "Echoes your name's graceful tone" }
      ],
      "lily": [
        { characters: "莉莉", pinyin: "Lì Lì", meaning: "Jasmine", source: "Phonetic match for Lily · 音译谐音", personalityMatch: "Matches your name's delicate sound" }
      ],
      "grace": [
        { characters: "格蕾丝", pinyin: "Gé Lěi Sī", meaning: "Pattern bud silk", source: "Phonetic match for Grace · 音译谐音", personalityMatch: "Captures your name's elegant sound" }
      ],
      "anna": [
        { characters: "安娜", pinyin: "Ān Nà", meaning: "Peaceful graceful", source: "Phonetic match for Anna · 音译谐音", personalityMatch: "Matches your name's gentle tone" }
      ],
    };
    
    // Find matching phonetic names
    for (const [key, names] of Object.entries(phoneticMap)) {
      if (name.includes(key)) {
        return names.slice(0, 2); // Max 2 phonetic names
      }
    }
    
    // Generate generic phonetic name if no match
    const firstChar = name.charAt(0).toUpperCase();
    const genericPhonetic: Record<string, ChineseName> = {
      "A": { characters: "艾", pinyin: "Ài", meaning: "Ivy, beautiful", source: "Phonetic starting with A · A音开头", personalityMatch: "Matches your name's initial sound" },
      "B": { characters: "贝", pinyin: "Bèi", meaning: "Shell, treasure", source: "Phonetic starting with B · B音开头", personalityMatch: "Echoes your name's beginning sound" },
      "C": { characters: "凯", pinyin: "Kǎi", meaning: "Victory, triumph", source: "Phonetic starting with C/K · C/K音开头", personalityMatch: "Matches your name's strong opening" },
      "D": { characters: "大", pinyin: "Dà", meaning: "Great, big", source: "Phonetic starting with D · D音开头", personalityMatch: "Captures your name's bold start" },
      "E": { characters: "伊", pinyin: "Yī", meaning: "That one, elegant", source: "Phonetic starting with E · E音开头", personalityMatch: "Matches your name's elegant sound" },
      "J": { characters: "杰", pinyin: "Jié", meaning: "Outstanding, hero", source: "Phonetic starting with J · J音开头", personalityMatch: "Echoes your name's strong beginning" },
      "M": { characters: "麦", pinyin: "Mài", meaning: "Wheat, harvest", source: "Phonetic starting with M · M音开头", personalityMatch: "Matches your name's warm tone" },
      "S": { characters: "思", pinyin: "Sī", meaning: "Think, thought", source: "Phonetic starting with S · S音开头", personalityMatch: "Captures your name's thoughtful sound" },
      "T": { characters: "泰", pinyin: "Tài", meaning: "Peaceful, safe", source: "Phonetic starting with T · T音开头", personalityMatch: "Matches your name's solid opening" },
    };
    
    if (genericPhonetic[firstChar]) {
      return [genericPhonetic[firstChar]];
    }
    
    return []; // No phonetic match
  };
  
  // Generate traditional high-quality Chinese names
  const generateTraditionalNames = (data: FormData, count: number): ChineseName[] => {
    // High-quality traditional name characters
    const maleNames: ChineseName[] = [
      { characters: "子轩", pinyin: "Zǐ Xuān", meaning: "Son of nobility", source: "From classical literature · 取自经典文学", personalityMatch: "Conveys dignity and scholarly grace" },
      { characters: "浩然", pinyin: "Hào Rán", meaning: "Vast and righteous", source: "Mencius · 《孟子》", personalityMatch: "Embodies grand moral character" },
      { characters: "睿渊", pinyin: "Ruì Yuān", meaning: "Wise and profound", source: "Ancient wisdom texts · 古籍智慧", personalityMatch: "Reflects deep intelligence" },
      { characters: "文博", pinyin: "Wén Bó", meaning: "Cultured and learned", source: "Traditional scholarly ideal · 传统学者风范", personalityMatch: "Shows literary excellence" },
      { characters: "俊熙", pinyin: "Jùn Xī", meaning: "Talented and bright", source: "Classical poetry · 古典诗词", personalityMatch: "Radiates talent and optimism" },
      { characters: "泽楷", pinyin: "Zé Kǎi", meaning: "Graceful model", source: "Confucian tradition · 儒家传统", personalityMatch: "Exemplifies virtuous conduct" },
      { characters: "明辉", pinyin: "Míng Huī", meaning: "Bright radiance", source: "Tang Dynasty poetry · 唐诗", personalityMatch: "Shines with inner light" },
      { characters: "修杰", pinyin: "Xiū Jié", meaning: "Cultivated excellence", source: "Classical cultivation · 修身之道", personalityMatch: "Demonstrates self-improvement" },
    ];
    
    const femaleNames: ChineseName[] = [
      { characters: "诗涵", pinyin: "Shī Hán", meaning: "Poetic grace", source: "Tang poetry tradition · 唐诗传统", personalityMatch: "Embodies artistic elegance" },
      { characters: "雅琪", pinyin: "Yǎ Qí", meaning: "Elegant jade", source: "Classical feminine ideal · 古典女性美", personalityMatch: "Radiates refined beauty" },
      { characters: "梦琪", pinyin: "Mèng Qí", meaning: "Dream jade", source: "Romantic poetry · 浪漫诗词", personalityMatch: "Carries dreamy elegance" },
      { characters: "雨萱", pinyin: "Yǔ Xuān", meaning: "Rain lily", source: "Nature poetry · 自然诗词", personalityMatch: "Fresh and nurturing spirit" },
      { characters: "欣怡", pinyin: "Xīn Yí", meaning: "Joyful harmony", source: "Classical blessings · 古典祝福", personalityMatch: "Brings happiness and peace" },
      { characters: "思颖", pinyin: "Sī Yǐng", meaning: "Thoughtful excellence", source: "Scholarly tradition · 学者传统", personalityMatch: "Shows intelligent grace" },
      { characters: "佳怡", pinyin: "Jiā Yí", meaning: "Beautiful harmony", source: "Traditional virtues · 传统美德", personalityMatch: "Radiates pleasant charm" },
      { characters: "若曦", pinyin: "Ruò Xī", meaning: "Like morning light", source: "Classical imagery · 古典意象", personalityMatch: "Gentle as dawn" },
    ];
    
    const neutralNames: ChineseName[] = [
      { characters: "文轩", pinyin: "Wén Xuān", meaning: "Cultured pavilion", source: "Scholarly tradition · 学者传统", personalityMatch: "Shows intellectual depth" },
      { characters: "明远", pinyin: "Míng Yuǎn", meaning: "Bright and far-reaching", source: "Classical wisdom · 古典智慧", personalityMatch: "Visionary and clear-minded" },
      { characters: "思远", pinyin: "Sī Yuǎn", meaning: "Thoughtful and far-seeing", source: "Philosophical texts · 哲学典籍", personalityMatch: "Deep thinker" },
      { characters: "清扬", pinyin: "Qīng Yáng", meaning: "Clear and elevated", source: "Book of Songs · 《诗经》", personalityMatch: "Pure and uplifting" },
      { characters: "云帆", pinyin: "Yún Fān", meaning: "Cloud sail", source: "Li Bai poetry · 李白诗", personalityMatch: "Adventurous spirit" },
      { characters: "景行", pinyin: "Jǐng Xíng", meaning: "Noble conduct", source: "Book of Songs · 《诗经》", personalityMatch: "Exemplary behavior" },
    ];
    
    let namePool: ChineseName[];
    if (data.gender === "male") {
      namePool = [...maleNames, ...neutralNames];
    } else if (data.gender === "female") {
      namePool = [...femaleNames, ...neutralNames];
    } else {
      namePool = [...neutralNames, ...maleNames.slice(0, 4), ...femaleNames.slice(0, 4)];
    }
    
    // Shuffle and return requested count
    const shuffled = namePool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Simple pinyin mapping
  const getPinyin = (chars: string): string => {
    const pinyinMap: Record<string, string> = {
      // New traditional names
      "子": "Zǐ", "轩": "Xuān", "浩": "Hào", "然": "Rán", "睿": "Ruì", "渊": "Yuān",
      "文": "Wén", "博": "Bó", "俊": "Jùn", "熙": "Xī", "泽": "Zé", "楷": "Kǎi",
      "明": "Míng", "辉": "Huī", "修": "Xiū", "杰": "Jié", "诗": "Shī", "涵": "Hán",
      "雅": "Yǎ", "琪": "Qí", "梦": "Mèng", "雨": "Yǔ", "萱": "Xuān", "欣": "Xīn",
      "怡": "Yí", "思": "Sī", "颖": "Yǐng", "佳": "Jiā", "若": "Ruò", "曦": "Xī",
      "远": "Yuǎn", "清": "Qīng", "扬": "Yáng", "云": "Yún", "帆": "Fān", "景": "Jǐng",
      "行": "Xíng", "李": "Lǐ", "奥": "Ào", "立": "Lì", "欧": "Ōu", "艾": "Ài",
      "力": "Lì", "大": "Dà", "维": "Wéi", "迈": "Mài", "克": "Kè", "强": "Qiáng",
      "索": "Suǒ", "菲": "Fēi", "莉": "Lì", "格": "Gé", "蕾": "Lěi", "丝": "Sī",
      "安": "Ān", "娜": "Nà", "贝": "Bèi", "伊": "Yī", "凯": "Kǎi", "泰": "Tài",
      "麦": "Mài", "吉": "Jí", "祥": "Xiáng", "瑞": "Ruì", "福": "Fú", "禄": "Lù",
      "寿": "Shòu", "康": "Kāng", "宁": "Níng", "和": "Hé", "平": "Píng", "顺": "Shùn",
      "达": "Dá", "兴": "Xīng", "盛": "Shèng", "昌": "Chāng", "隆": "Lóng", "华": "Huá",
      "富": "Fù", "贵": "Guì", "荣": "Róng", "耀": "Yào", "光": "Guāng", "彩": "Cǎi",
      "灵": "Líng", "秀": "Xiù", "英": "Yīng", "伟": "Wěi", "毅": "Yì",
      "刚": "Gāng", "勇": "Yǒng", "智": "Zhì", "慧": "Huì", "仁": "Rén", "义": "Yì",
      "礼": "Lǐ", "信": "Xìn", "忠": "Zhōng", "孝": "Xiào", "廉": "Lián", "耻": "Chǐ",
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
              <span className="hidden sm:inline">Names 名字 ({displayNames.length})</span>
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
                    <span>楷书 KaiShu · 颜真卿风格</span>
                    <span className="text-green-600 text-xs ml-auto">Free 免费</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">2</span>
                    <span>行书 XingShu · 王羲之风格</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">3</span>
                    <span>隶书 LiShu · 汉隶风格</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">4</span>
                    <span>魏碑 WeiBei · 方正有力</span>
                    {proStatus.isPro ? <span className="text-green-600 text-xs ml-auto">Unlocked 已解锁</span> : <span className="text-amber-600 text-xs ml-auto">Pro</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-amber-100 rounded text-amber-700 text-center text-xs font-bold">5</span>
                    <span>篆书 ZhuanShu · 小篆风格</span>
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
                        <h4 className="font-semibold text-stone-700">飘逸签名 · Cursive</h4>
                        <p className="text-sm text-stone-500">流畅自然</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">正式签名 · Formal</h4>
                        <p className="text-sm text-stone-500">端庄稳重</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">艺术签名1 · Artistic 1</h4>
                        <p className="text-sm text-stone-500">优雅灵动</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-semibold text-stone-700">艺术签名2 · Artistic 2</h4>
                        <p className="text-sm text-stone-500">大气磅礴</p>
                        {proStatus.isPro ? (
                          <span className="text-xs text-green-600">Available 可用</span>
                        ) : (
                          <span className="text-xs text-amber-600">Pro Required</span>
                        )}
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-700">照片合成 · Photo Merge</h4>
                        <p className="text-sm text-amber-600">签名与照片融合</p>
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

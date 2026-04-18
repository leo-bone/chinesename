"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Info, Palette, BookOpen, Sparkle, Star, Users, Globe } from "lucide-react";
import Link from "next/link";

interface FormData {
  englishName: string;
  gender: string;
  age: number;
  personality: string;
  interests: string;
  profession: string;
  desiredMeaning: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    englishName: "",
    gender: "",
    age: 25,
    personality: "",
    interests: "",
    profession: "",
    desiredMeaning: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store form data in localStorage for the result page
    localStorage.setItem("chineseNameForm", JSON.stringify(formData));
    
    // Navigate to result page
    window.location.href = "/result";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full bg-white/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-lg font-semibold text-stone-800 hover:text-red-700 transition-colors">
              Chinese Name Generator
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-stone-600 hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          Trusted by 50,000+ people worldwide
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4 tracking-tight">
          Discover Your
          <span className="block text-red-700">Chinese Name</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
          Get a meaningful Chinese name rooted in 3,000 years of classical poetry and tradition.
          Each name is carefully crafted to reflect who you truly are.
        </p>
        {/* Social proof row */}
        <div className="flex items-center justify-center gap-6 text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-stone-400" />
            <span>180+ countries</span>
          </div>
          <div className="w-1 h-1 bg-stone-300 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-stone-400" />
            <span>50K+ names created</span>
          </div>
          <div className="w-1 h-1 bg-stone-300 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>4.9/5 rating</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border-stone-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-stone-800">Create Your Chinese Name</CardTitle>
          <CardDescription className="text-stone-500">
            Share a little about yourself — we&apos;ll craft 5 personalized names from classical Chinese literature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* English Name */}
            <div className="space-y-2">
              <Label htmlFor="englishName" className="text-stone-700">
                Your English Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="englishName"
                placeholder="e.g., Michael, Sarah"
                value={formData.englishName}
                onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                required
                className="border-stone-300 focus:border-red-700 focus:ring-red-700"
              />
            </div>

            {/* Gender & Age Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-stone-700">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value || "" })}
                  required
                >
                  <SelectTrigger className="border-stone-300 focus:border-red-700 focus:ring-red-700">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700">Age: {formData.age}</Label>
                <Slider
                  value={[formData.age]}
                  onValueChange={(value) => setFormData({ ...formData, age: Array.isArray(value) ? value[0] : value })}
                  min={10}
                  max={80}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>

            {/* Personality */}
            <div className="space-y-2">
              <Label htmlFor="personality" className="text-stone-700">
                How would you describe your personality? <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.personality}
                onValueChange={(value) => setFormData({ ...formData, personality: value || "" })}
                required
              >
                <SelectTrigger className="border-stone-300 focus:border-red-700 focus:ring-red-700">
                  <SelectValue placeholder="Select your personality type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambitious-driven">Ambitious & Driven</SelectItem>
                  <SelectItem value="calm-peaceful">Calm & Peaceful</SelectItem>
                  <SelectItem value="creative-artistic">Creative & Artistic</SelectItem>
                  <SelectItem value="wise-thoughtful">Wise & Thoughtful</SelectItem>
                  <SelectItem value="energetic-outgoing">Energetic & Outgoing</SelectItem>
                  <SelectItem value="gentle-kind">Gentle & Kind</SelectItem>
                  <SelectItem value="strong-resilient">Strong & Resilient</SelectItem>
                  <SelectItem value="curious-intellectual">Curious & Intellectual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests" className="text-stone-700">
                What are your main interests or hobbies?
              </Label>
              <Input
                id="interests"
                placeholder="e.g., hiking, reading, martial arts, tea ceremony, music..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="border-stone-300 focus:border-red-700 focus:ring-red-700"
              />
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-stone-700">
                What is your profession or field of study?
              </Label>
              <Input
                id="profession"
                placeholder="e.g., software engineer, teacher, artist, student..."
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="border-stone-300 focus:border-red-700 focus:ring-red-700"
              />
            </div>

            {/* Desired Meaning */}
            <div className="space-y-2">
              <Label htmlFor="desiredMeaning" className="text-stone-700">
                What qualities or meanings would you like your name to convey?
              </Label>
              <Input
                id="desiredMeaning"
                placeholder="e.g., wisdom, strength, harmony, success, beauty..."
                value={formData.desiredMeaning}
                onChange={(e) => setFormData({ ...formData, desiredMeaning: e.target.value })}
                className="border-stone-300 focus:border-red-700 focus:ring-red-700"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-900 text-white py-6 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Your Names...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate My Chinese Names
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-6 h-6 text-red-700" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-2">Classical Calligraphy</h3>
          <p className="text-stone-600 text-sm">5 traditional styles — from KaiShu to ZhuanShu — rendered with authentic ink artistry</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-red-700" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-2">Literary Origins</h3>
          <p className="text-stone-600 text-sm">Names drawn from the Book of Songs, Tang poetry, Confucian classics and Taoist texts</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkle className="w-6 h-6 text-red-700" />
          </div>
          <h3 className="font-semibold text-stone-800 mb-2">Truly Personal</h3>
          <p className="text-stone-600 text-sm">Matched to your personality, interests and aspirations — not just a phonetic translation</p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-12 max-w-4xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Sarah M.", country: "🇺🇸 USA", text: "I was amazed — my Chinese name 若兰 (Ruò Lán) means 'like an orchid' and fits my personality perfectly!", rating: 5 },
            { name: "James L.", country: "🇬🇧 UK", text: "浩然 (Hào Rán) — my Chinese teacher said it's a beautiful and culturally authentic name. Very impressed!", rating: 5 },
            { name: "Marie D.", country: "🇫🇷 France", text: "Not just a translation — a real Chinese name with deep meaning from classical poetry. Absolutely love it.", rating: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-700 text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-700">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-stone-400 text-xs">
        <p>Crafted with cultural authenticity · Drawing from 3,000 years of Chinese literary tradition</p>
      </footer>
      </div>
    </div>
  );
}

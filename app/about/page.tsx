import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles, Heart, Quote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Chinese Name Generator",
  description: "Learn about the art and philosophy of Chinese naming. Discover how classical poetry, Confucian ideals and 3,000 years of literary tradition shape every name we create.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-stone-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">名</div>
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            The Art of Chinese Naming
          </h1>
          <p className="text-lg text-stone-600 max-w-xl mx-auto">
            A name is not just a label — it is a poem, a blessing, and a window into one&apos;s soul.
          </p>
        </div>

        {/* Pull quote */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-8 mb-8 text-center">
          <Quote className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-xl font-semibold text-stone-800 mb-3 leading-relaxed" 
             style={{ fontFamily: "'Noto Serif SC', serif" }}>
            名不正则言不顺，言不顺则事不成
          </p>
          <p className="text-stone-600 italic">
            &ldquo;If names are not correct, words will not ring true. If words do not ring true, affairs cannot be accomplished.&rdquo;
          </p>
          <p className="text-stone-400 text-sm mt-2">— Confucius, The Analects (551–479 BC)</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Mission */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">Our Mission</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-4">
              We believe a Chinese name should be more than a phonetic approximation of your Western name. 
              It should carry meaning, evoke imagery, and connect you to a living literary tradition that 
              spans three millennia.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Our mission is to help people from around the world discover Chinese names that are 
              genuinely beautiful, culturally authentic, and personally resonant — names that a native 
              Chinese speaker would recognize as thoughtful and meaningful.
            </p>
          </section>

          {/* The Art of Chinese Naming */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">How Chinese Names Work</h2>
            </div>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                A Chinese name typically consists of a one-character family name (姓) followed by 
                one or two given characters (名). Each character is chosen with extraordinary care — 
                not just for meaning, but for its sound, visual beauty, and cultural resonance.
              </p>
              <p>
                The finest names draw from China&apos;s greatest literary works: the <em>Book of Songs</em> (诗经, 
                circa 1000 BC), the <em>Analects</em> (论语), the <em>Tao Te Ching</em> (道德经), the poetry of 
                Du Fu and Li Bai, and the classical <em>Chu Ci</em> (楚辞). A single character can carry 
                centuries of cultural meaning.
              </p>
              <p>
                For example, <strong>浩然</strong> (Hào Rán) comes directly from Mencius: 
                &ldquo;I am skilled at nurturing my vast, righteous spirit&rdquo; — two characters that 
                encode a complete philosophy of moral cultivation.
              </p>
            </div>
          </section>

          {/* Literary Sources */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">Our Literary Sources</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "诗经 Book of Songs", period: "1000–600 BC", desc: "China's earliest poetry collection, the foundation of classical naming tradition" },
                { title: "楚辞 Songs of Chu", period: "300 BC", desc: "Qu Yuan's romantic poetry — source of fragrant orchid and chrysanthemum imagery" },
                { title: "论语 The Analects", period: "479 BC", desc: "Confucius's teachings on virtue, knowledge and the ideal person" },
                { title: "道德经 Tao Te Ching", period: "400 BC", desc: "Laozi's Taoist philosophy of natural harmony and inner strength" },
                { title: "唐诗 Tang Poetry", period: "618–907 AD", desc: "The golden age of Chinese poetry — Li Bai, Du Fu, Wang Wei" },
                { title: "宋词 Song Ci", period: "960–1279 AD", desc: "Lyrical verse of Su Shi and Li Qingzhao — elegant and emotionally deep" },
              ].map((source, i) => (
                <div key={i} className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                  <h4 className="font-semibold text-stone-800 text-sm">{source.title}</h4>
                  <p className="text-xs text-red-600 mb-1">{source.period}</p>
                  <p className="text-xs text-stone-500">{source.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">How We Create Your Name</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  1
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">You Share Your Story</h3>
                <p className="text-sm text-stone-600">Your personality, interests, profession and the qualities you want your name to embody</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  2
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">We Match Characters</h3>
                <p className="text-sm text-stone-600">We scan thousands of classical characters and literary sources to find those that best reflect your traits</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  3
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">You Receive Names</h3>
                <p className="text-sm text-stone-600">Each name comes with its literary origin, full meaning, and an explanation of why it suits you</p>
              </div>
            </div>
          </section>

          {/* Cultural Note */}
          <section className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200">
            <h2 className="text-xl font-bold text-stone-800 mb-4">A Note on Cultural Respect</h2>
            <p className="text-stone-600 leading-relaxed">
              Chinese naming is a tradition that spans thousands of years and carries profound cultural 
              significance. We approach this art with deep respect for the culture and literature that 
              inform it. Every name we generate is grounded in authentic classical sources, and we strive 
              to create names that a native Chinese speaker would recognize as beautiful, meaningful, and 
              appropriate — not mere phonetic approximations or superficial translations.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="bg-red-800 hover:bg-red-900 text-white px-8 py-6 text-lg shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Your Chinese Name
            </Button>
          </Link>
          <p className="mt-3 text-sm text-stone-400">Free · No account required · 2 minutes</p>
        </div>
      </div>
    </div>
  );
}

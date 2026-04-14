import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Sparkles, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Chinese Name Generator",
  description: "Learn about our mission to bridge cultures through the art of Chinese naming. Discover the cultural significance and poetry behind each name.",
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
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            About Chinese Name Generator
          </h1>
          <p className="text-lg text-stone-600">
            Bridging cultures through the art of naming
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Mission */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">Our Mission</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              We believe a name is more than just a label—it is a poem, a blessing, and a reflection of one&apos;s soul. 
              Our mission is to help people from around the world discover Chinese names that resonate with their 
              personality, aspirations, and life journey.
            </p>
          </section>

          {/* The Art of Chinese Naming */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">The Art of Chinese Naming</h2>
            </div>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                In Chinese culture, names carry profound significance. A well-chosen name draws from centuries 
                of literary tradition—from the <em>Book of Songs</em> (诗经) to Tang Dynasty poetry, from 
                Confucian classics to Taoist philosophy.
              </p>
              <p>
                Each character is carefully selected not just for its meaning, but for its sound, its visual 
                beauty, and the cultural resonance it carries. The best names evoke imagery: a mountain stream, 
                a morning star, the virtue of a scholar, or the grace of nature.
              </p>
              <p>
                Our AI has been trained on these classical texts and naming conventions to generate names 
                that are both culturally authentic and personally meaningful.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-700 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Share Your Story</h3>
                <p className="text-sm text-stone-600">Tell us about your personality, interests, and aspirations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-700 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">AI Crafting</h3>
                <p className="text-sm text-stone-600">Our AI draws from classical Chinese literature</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-700 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Discover Names</h3>
                <p className="text-sm text-stone-600">Receive personalized names with meanings and calligraphy</p>
              </div>
            </div>
          </section>

          {/* Cultural Note */}
          <section className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200">
            <h2 className="text-xl font-bold text-stone-800 mb-4">A Note on Cultural Respect</h2>
            <p className="text-stone-600 leading-relaxed">
              Chinese naming is a tradition that spans thousands of years. We approach this art with deep respect 
              for the culture and literature that inform it. Each name we generate is rooted in authentic classical 
              sources, and we strive to create names that would be recognized as beautiful and meaningful by 
              native Chinese speakers.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="bg-red-800 hover:bg-red-900 text-white px-8 py-6 text-lg">
              Get Your Chinese Name
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

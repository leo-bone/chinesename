import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Chinese Name Generator",
  description: "Learn how Chinese Name Generator collects, uses, and protects your personal information when you use our service.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-stone-400">
            Last Updated: May 6, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Intro */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <p className="text-stone-600 leading-relaxed">
              Chinese Name Generator (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at
              chinesename.uichain.org. This page informs you of our policies regarding
              the collection, use, and disclosure of personal data when you use our service.
            </p>
          </section>

          {/* Section 1 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-700" />
              <h2 className="text-2xl font-bold text-stone-800">1. Information We Collect</h2>
            </div>
            <h3 className="font-semibold text-stone-800 mb-2">Information You Provide:</h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1 mb-4 ml-2">
              <li>English name</li>
              <li>Gender preference</li>
              <li>Age</li>
              <li>Personality type</li>
              <li>Interests and hobbies</li>
              <li>Profession</li>
              <li>Desired name meaning</li>
            </ul>
            <h3 className="font-semibold text-stone-800 mb-2">Automatically Collected:</h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-stone-600 mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2">
              <li>Generate personalized Chinese names based on your input</li>
              <li>Improve our service and user experience</li>
              <li>Analyze usage patterns to enhance functionality</li>
              <li>Communicate with you about our service</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">3. Data Storage and Security</h2>
            <p className="text-stone-600 leading-relaxed">
              Your data is stored securely using industry-standard encryption. We retain your
              information only as long as necessary to provide our services. Form input data is
              processed temporarily and is not permanently stored on our servers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">4. Cookies</h2>
            <p className="text-stone-600 mb-3">We use cookies to:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage</li>
              <li>Provide essential functionality</li>
            </ul>
            <p className="text-stone-600 leading-relaxed">
              You can control cookies through your browser settings. Disabling cookies may affect
              some features of our service.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">5. Third-Party Services</h2>
            <p className="text-stone-600 mb-3">We may use third-party services for:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2 mb-4">
              <li>AI name generation (DeepSeek API)</li>
              <li>Analytics</li>
              <li>Payment processing (for Pro version)</li>
            </ul>
            <p className="text-stone-600 leading-relaxed">
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">6. Children&apos;s Privacy</h2>
            <p className="text-stone-600 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">7. Your Rights</h2>
            <p className="text-stone-600 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of communications</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">8. Data Sharing</h2>
            <p className="text-stone-600 mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may
              share data with:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-2">
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">9. International Transfers</h2>
            <p className="text-stone-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">10. Changes to This Policy</h2>
            <p className="text-stone-600 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-4">11. Contact Us</h2>
            <p className="text-stone-600 mb-3">
              If you have questions about this privacy policy, please contact us:
            </p>
            <p className="text-stone-700">
              <strong>Email:</strong> support@uichain.org
              <br />
              <strong>Website:</strong> https://uichain.org
            </p>
          </section>

          {/* Cultural Note */}
          <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200">
            <strong className="text-red-800">Note:</strong>
            <span className="text-stone-600">
              {" "}
              The Chinese Name Generator is a cultural and educational tool. Names generated are
              based on classical Chinese literature and AI analysis, and should be used for personal
              and cultural exploration purposes.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-stone-400">
            &copy; 2026 Chinese Name Generator. All rights reserved.
          </p>
          <p className="text-xs text-stone-300 mt-1">Part of UIChain Global SME Growth Platform</p>
        </div>
      </div>
    </div>
  );
}

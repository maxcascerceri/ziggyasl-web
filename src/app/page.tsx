import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureSection } from "@/components/FeatureSection";
import { WhyZiggy } from "@/components/WhyZiggy";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { BlogStrip, DictionaryStrip, LearnStrip } from "@/components/HomeStrips";
import { HomeFAQ } from "@/components/HomeFAQ";
import { StickerDrift } from "@/components/StickerDrift";

export const metadata: Metadata = {
  title: "Learn American Sign Language (ASL) Free | Ziggy Sign Language App",
  description:
    "Learn ASL with real video: a free dictionary of 700+ signs, the ASL alphabet, beginner lessons, and the Ziggy app for 5-minute daily sign language practice.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />

        <div className="relative">
          <StickerDrift
            items={[
              { name: "unit-sticker-getting-started", top: "6%", side: "left", rotate: -8, depth: 0.8 },
              { name: "unit-sticker-everyday-replies", top: "34%", side: "right", rotate: 7, size: 64, depth: 1.2 },
              { name: "unit-sticker-alphabet", top: "64%", side: "left", rotate: 6, size: 68, depth: 1 },
              { name: "unit-sticker-numbers", top: "88%", side: "right", rotate: -6, size: 60, depth: 0.7 },
            ]}
          />
          <DictionaryStrip />
          <LearnStrip />
        </div>

        <div className="relative space-y-28 py-12 sm:space-y-36 sm:py-16">
          <StickerDrift
            items={[
              { name: "sign", top: "8%", side: "left", rotate: -7, depth: 1 },
              { name: "unit-sticker-getting-around", top: "44%", side: "right", rotate: 8, size: 68, depth: 0.9 },
              { name: "10streak", top: "80%", side: "left", rotate: 6, size: 64, depth: 1.2 },
            ]}
          />
          {copy.features.map((feature, i) => (
            <FeatureSection
              key={feature.title}
              title={feature.title}
              body={feature.body}
              screenshot={feature.screenshot}
              screenshotAlt={feature.screenshotAlt}
              reversed={i % 2 === 1}
              mascot={i === 0 ? "/brand/ziggy-teach-sm.webp" : undefined}
            />
          ))}
        </div>

        <WhyZiggy />
        <div className="relative">
          <StickerDrift
            items={[
              { name: "talking", top: "10%", side: "right", rotate: 7, size: 68, depth: 1 },
              { name: "questions", top: "52%", side: "left", rotate: -6, size: 64, depth: 0.9 },
            ]}
          />
          <BlogStrip />
          <HomeFAQ />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

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
import { SceneDrift } from "@/components/SceneDrift";

export const metadata: Metadata = {
  title: "Learn American Sign Language (ASL) | Free Video Dictionary & Ziggy App",
  description:
    "Learn ASL with real video: a free dictionary of 700+ signs, the ASL alphabet, beginner lessons, and the Ziggy app for a few minutes of sign language practice a day.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />

        <div className="relative">
          <SceneDrift
            items={[
              { scene: "p1-u01", top: "6%", side: "left", rotate: -4, size: 88, depth: 0.8 },
              { scene: "p1-u02", top: "34%", side: "right", rotate: 3, size: 80, depth: 1.2 },
              { scene: "p1-u10", top: "64%", side: "left", rotate: 3, size: 84, depth: 1 },
              { scene: "p1-u15", top: "88%", side: "right", rotate: -3, size: 76, depth: 0.7 },
            ]}
          />
          <DictionaryStrip />
          <LearnStrip />
        </div>

        <div className="relative space-y-28 py-12 sm:space-y-36 sm:py-16">
          <SceneDrift
            items={[
              { scene: "p1-u22", top: "8%", side: "left", rotate: -3, size: 88, depth: 1 },
              { scene: "p1-u74", top: "44%", side: "right", rotate: 4, size: 84, depth: 0.9 },
              { scene: "p1-prove-01", top: "80%", side: "left", rotate: 3, size: 80, depth: 1.2 },
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
          <SceneDrift
            items={[
              { scene: "p1-u81", top: "10%", side: "right", rotate: 3, size: 84, depth: 1 },
              { scene: "p1-u05", top: "52%", side: "left", rotate: -3, size: 80, depth: 0.9 },
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

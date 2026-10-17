import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureSection } from "@/components/FeatureSection";
import { WhyZiggy } from "@/components/WhyZiggy";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { BlogStrip, DictionaryStrip, LearnStrip } from "@/components/HomeStrips";

export const metadata: Metadata = {
  title: "Ziggy: Learn ASL with Real Video | Free Sign Language Dictionary",
  description:
    "Learn American Sign Language with a free video dictionary of 700+ signs, beginner guides written by ASL teachers, and the Ziggy app for daily practice.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />

        <DictionaryStrip />
        <LearnStrip />

        <div className="space-y-28 py-12 sm:space-y-36 sm:py-16">
          {copy.features.map((feature, i) => (
            <FeatureSection
              key={feature.title}
              title={feature.title}
              body={feature.body}
              screenshot={feature.screenshot}
              screenshotAlt={feature.screenshotAlt}
              reversed={i % 2 === 1}
              mascot={i === 0 ? "/brand/ziggy-teach.png" : undefined}
            />
          ))}
        </div>

        <WhyZiggy />
        <BlogStrip />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

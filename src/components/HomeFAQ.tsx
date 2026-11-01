import Link from "next/link";
import { FAQ, type FAQItem } from "./FAQ";
import { Container, JsonLd } from "./ui";

const ITEMS: FAQItem[] = [
  {
    q: "What's the fastest way to learn ASL?",
    a: "Short daily practice beats long occasional sessions. Five minutes a day with real video, reviewing signs you actually use, is what sticks. Ziggy's lessons are built around exactly that.",
  },
  {
    q: "Can I learn ASL on my own?",
    a: "Yes. Real video replaces a lot of what a classroom gives you: the handshape, the movement, and the facial expression. A free dictionary plus daily practice gets most beginners conversational at a basic level.",
  },
  {
    q: "How long does it take to learn ASL?",
    a: "Useful everyday signs take a few weeks of daily practice. Holding a simple conversation usually takes several months. Fluency is measured in years, the same as any language.",
  },
  {
    q: "Is ASL hard to learn?",
    a: "The first signs are easy and satisfying. What takes time is grammar, which is not English word order, and facial expression, which carries meaning. Both are teachable and both are in the lessons.",
  },
  {
    q: "Is sign language universal?",
    a: "No. American Sign Language is its own language, used in the US and much of Canada. British Sign Language is different, and most countries have their own. ASL and English share a country, not a grammar.",
  },
  {
    q: "What are the first signs to learn?",
    a: "Start with the alphabet, then hello, thank you, please, yes, no, and your name. Those cover introductions, which is where every real conversation starts.",
  },
  {
    q: "Does Duolingo have ASL?",
    a: "No. Duolingo does not offer American Sign Language. Ziggy is a free app built only for ASL, with real video of every sign instead of illustrations.",
  },
  {
    q: "Is Ziggy free?",
    a: "The dictionary and the beginner guides are free, and the app is free to start. Some longer lesson paths are part of Ziggy Plus.",
  },
];

export function HomeFAQ() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="py-12 sm:py-16">
      <Container narrow>
        <JsonLd data={ld} />
        <FAQ items={ITEMS} title="Questions about learning American Sign Language" />
        <p className="mt-6 text-secondary">
          More answers in the{" "}
          <Link href="/learn" className="font-extrabold text-brand-text underline-offset-4 hover:underline">
            beginner guides
          </Link>{" "}
          and the{" "}
          <Link href="/blog" className="font-extrabold text-brand-text underline-offset-4 hover:underline">
            blog
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

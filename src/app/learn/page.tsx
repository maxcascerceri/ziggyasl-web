import type { Metadata } from "next";
import Link from "next/link";
import { AppCTA } from "@/components/AppCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/Icons";
import { FadeIn, RiseIn } from "@/components/Motion";
import { Container, Eyebrow, JsonLd, SectionHeading } from "@/components/ui";
import { getSigns } from "@/lib/catalog";
import { signThumbURL } from "@/lib/firebasePublic";
import { LEARN_GUIDES } from "@/lib/learnGuides";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn ASL: Free Beginner Guides with Video",
  description:
    "Free American Sign Language guides for beginners: the alphabet, numbers, basic phrases, greetings, question words, and more. Every sign on real video, written by ASL teachers.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn ASL: Free Beginner Guides with Video | Ziggy",
    description: "The ASL alphabet, numbers, basic phrases, and more, each with real video and practice.",
    url: absoluteUrl("/learn"),
  },
};

const PATH_ORDER = [
  "asl-alphabet",
  "asl-greetings",
  "basic-asl-phrases",
  "asl-pronouns",
  "asl-question-words",
  "asl-feelings",
  "asl-numbers",
  "asl-family-signs",
  "asl-colors",
  "days-of-the-week-asl",
  "asl-food-signs",
  "deaf-culture-basics",
];

export default function LearnPage() {
  const guides = PATH_ORDER.map((s) => LEARN_GUIDES.find((g) => g.slug === s)!).filter(Boolean);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/learn"),
    name: "Learn ASL",
    url: absoluteUrl("/learn"),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: guides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: absoluteUrl(`/learn/${g.slug}`),
    })),
  };

  return (
    <>
      <Header solid />
      <JsonLd data={ld} />
      <main className="flex-1 pt-32 sm:pt-36">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <RiseIn>
              <Eyebrow>Learn ASL</Eyebrow>
            </RiseIn>
            <RiseIn delay={0.06}>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Beginner guides, in the order a teacher would give them
              </h1>
            </RiseIn>
            <RiseIn delay={0.12}>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-secondary">
                Twelve short guides that take you from your first fingerspelled name to a real
                first conversation. Every sign is on video. Every guide ends with practice.
              </p>
            </RiseIn>
          </div>
        </Container>

        <Container className="mt-16">
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => {
              const peek = getSigns(g.signIds.slice(0, 4));
              return (
                <li key={g.slug}>
                  <FadeIn delay={Math.min(i, 5) * 0.04} className="h-full">
                    <Link
                      href={`/learn/${g.slug}`}
                      className={`card-lift tint-${g.tint} group flex h-full flex-col rounded-[28px] bg-[var(--tint)] p-6`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm font-bold text-ink">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink/60">
                          {g.minutes} min · {g.signIds.length} signs
                        </span>
                      </div>
                      <h2 className="mt-5 text-balance text-xl font-bold leading-tight text-ink">
                        {g.shortTitle}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/75">
                        {g.description}
                      </p>
                      <div className="mt-auto flex items-end justify-between pt-6">
                        <div className="flex -space-x-3">
                          {peek.map((s, j) => (
                            <span
                              key={s.id}
                              className="relative overflow-hidden rounded-xl bg-white shadow-card outline outline-2 outline-[var(--tint)]"
                              style={{ width: 64, height: 42, zIndex: 4 - j }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={signThumbURL(s.id)}
                                alt=""
                                width={64}
                                height={42}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--tint-icon)] transition-transform group-hover:translate-x-0.5">
                          <ArrowRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                </li>
              );
            })}
          </ol>
        </Container>

        <Container className="mt-24">
          <FadeIn>
            <SectionHeading
              eyebrow="Go deeper"
              title="Read about how ASL actually works"
              action={{ label: "All posts", href: "/blog" }}
            />
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="card-lift block h-full rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-shadow">{p.minutes} min read</p>
                  <p className="mt-2 text-lg font-bold leading-tight text-ink">{p.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-secondary">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>

        <Container narrow className="mb-24 mt-24">
          <AppCTA />
        </Container>
      </main>
      <Footer />
    </>
  );
}

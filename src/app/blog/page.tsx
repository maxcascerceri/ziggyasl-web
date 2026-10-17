import type { Metadata } from "next";
import Link from "next/link";
import { AppCTA } from "@/components/AppCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/Icons";
import { FadeIn, RiseIn } from "@/components/Motion";
import { Container, Eyebrow, JsonLd } from "@/components/ui";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "ASL Blog: Learning Tips, Grammar, and Deaf Culture",
  description:
    "Honest, teacher-written articles about learning American Sign Language: how long it takes, the first signs to learn, ASL grammar, Deaf culture etiquette, fingerspelling, and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ASL Blog: Learning Tips, Grammar, and Deaf Culture | Ziggy",
    description: "Teacher-written articles on learning ASL, with real video for every sign mentioned.",
    url: absoluteUrl("/blog"),
  },
};

export default function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog"),
    name: "Ziggy ASL Blog",
    url: absoluteUrl("/blog"),
    publisher: { "@id": `${SITE_URL}/#organization` },
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt,
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
              <Eyebrow>Blog</Eyebrow>
            </RiseIn>
            <RiseIn delay={0.06}>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Straight talk about learning ASL
              </h1>
            </RiseIn>
            <RiseIn delay={0.12}>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-secondary">
                Written by teachers, checked against how Deaf people actually sign. Every sign we
                mention links to a real video.
              </p>
            </RiseIn>
          </div>
        </Container>

        <Container className="mt-16">
          <FadeIn>
            <Link
              href={`/blog/${featured.slug}`}
              className={`card-lift tint-${featured.tint} group grid gap-6 rounded-[32px] bg-[var(--tint)] p-7 sm:grid-cols-[1fr_auto] sm:items-end sm:p-10`}
            >
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
                  Start here · {featured.minutes} min read
                </p>
                <h2 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-pretty text-lg text-ink/80">{featured.description}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--tint-icon)] transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={22} />
              </span>
            </Link>
          </FadeIn>
        </Container>

        <Container className="mt-10">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <li key={p.slug}>
                <FadeIn delay={Math.min(i, 5) * 0.04} className="h-full">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="card-lift group flex h-full flex-col rounded-[28px] bg-white p-6 outline outline-1 -outline-offset-1 outline-black/5"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-shadow">
                      {p.minutes} min read
                    </p>
                    <h2 className="mt-3 text-balance text-xl font-bold leading-tight text-ink">
                      {p.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">
                      {p.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand">
                      Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </FadeIn>
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

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { preconnect, preload } from "react-dom";
import { AppCTA } from "@/components/AppCTA";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ChevronLeft, ChevronRight, HandIcon } from "@/components/Icons";
import { FadeIn } from "@/components/Motion";
import { SignCard, SignGrid } from "@/components/SignCard";
import { SignVideo } from "@/components/SignVideo";
import {
  Breadcrumbs,
  Chip,
  Container,
  Eyebrow,
  JsonLd,
  MascotNote,
  SectionHeading,
} from "@/components/ui";
import {
  allSigns,
  getSignBySlug,
  getSigns,
  primaryCategory,
  siblings,
  getCategory,
  type Sign,
  toSignCardData,
} from "@/lib/catalog";
import { signPosterURL, signVideoURL } from "@/lib/firebasePublic";
import { guideForSign } from "@/lib/learnGuides";
import { getSignContent } from "@/lib/signContent";
import { absoluteUrl, AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";
import { relatedPostsForSign } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return allSigns().map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

function titleFor(sign: Sign): string {
  const alias = sign.aliases.length ? ` / ${sign.aliases.join(" / ")}` : "";
  return `${sign.display}${alias} in ASL`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sign = getSignBySlug(slug);
  if (!sign) return {};
  const content = getSignContent(sign);
  const title = `${titleFor(sign)}: How to Sign ${sign.display} (Video)`;
  const description = `${content.summary} Free ASL video dictionary from Ziggy.`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `/sign/${sign.slug}` },
    openGraph: {
      title,
      description,
      type: "video.other",
      url: absoluteUrl(`/sign/${sign.slug}`),
      videos: [
        {
          url: signVideoURL(sign.id),
          type: "video/mp4",
          width: sign.media.width || 960,
          height: sign.media.height || 540,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SignPage({ params }: Params) {
  const { slug } = await params;
  const sign = getSignBySlug(slug);
  if (!sign) notFound();

  // The poster is the LCP element on this page; get it in flight before hydration.
  preload(signPosterURL(sign.id), { as: "image", fetchPriority: "high" });
  preconnect("https://firebasestorage.googleapis.com");

  const content = getSignContent(sign);
  const category = primaryCategory(sign);
  const { prev, next } = siblings(sign);
  const related = getSigns(sign.relatedIds).slice(0, 8);
  const components = getSigns(sign.phraseComponents);
  const guide = guideForSign(sign.categoryIds);
  const posts = relatedPostsForSign(sign);
  const tip = sign.tips[0];
  const url = absoluteUrl(`/sign/${sign.slug}`);
  const h1 = titleFor(sign);

  const crumbs = [
    { label: "Dictionary", href: "/dictionary" },
    ...(category
      ? [{ label: category.title, href: `/dictionary/${category.slug}` }]
      : []),
    { label: sign.display },
  ];

  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    name: `${sign.display} in ASL`,
    description: content.summary,
    thumbnailUrl: [signPosterURL(sign.id)],
    contentUrl: signVideoURL(sign.id),
    uploadDate: "2026-07-06T00:00:00Z",
    duration: sign.media.isoDuration,
    width: sign.media.width || 960,
    height: sign.media.height || 540,
    inLanguage: "ase",
    isFamilyFriendly: true,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Dictionary", item: absoluteUrl("/dictionary") },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category.title,
              item: absoluteUrl(`/dictionary/${category.slug}`),
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 4 : 3,
        name: sign.display,
        item: url,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const termLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${url}#term`,
    name: sign.display,
    alternateName: sign.aliases,
    description: content.summary,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/dictionary#set`,
      name: `${SITE_NAME} ASL Dictionary`,
      url: absoluteUrl("/dictionary"),
    },
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: h1,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${url}#term` },
    video: { "@id": `${url}#video` },
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    dateModified: "2026-10-17",
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[videoLd, breadcrumbLd, faqLd, termLd, pageLd]} />
      <main className="flex-1 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <SignVideo
              src={signVideoURL(sign.id)}
              poster={signPosterURL(sign.id)}
              label={`Video of the ASL sign for ${sign.display}`}
              priority
            />

            <div>
              <Eyebrow>How to sign</Eyebrow>
              <h1 className="mt-2 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {h1}
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-secondary">
                {content.summary}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Quick facts">
                <li>
                  <Chip tint={category?.tint ?? "blue"}>
                    {sign.type === "phrase" ? "Phrase" : "Single sign"}
                  </Chip>
                </li>
                {content.hands ? (
                  <li>
                    <Chip>
                      <HandIcon size={14} />
                      {content.hands === "two" ? "Two hands" : "One hand"}
                    </Chip>
                  </li>
                ) : null}
                {content.handshape ? (
                  <li>
                    <Chip>Handshape: {content.handshape}</Chip>
                  </li>
                ) : null}
                {content.location ? (
                  <li>
                    <Chip>{content.location}</Chip>
                  </li>
                ) : null}
                {category ? (
                  <li>
                    <Chip href={`/dictionary/${category.slug}`}>{category.title}</Chip>
                  </li>
                ) : null}
                {sign.categoryIds.slice(1, 3).map((id) => {
                  const c = getCategory(id);
                  return c ? (
                    <li key={id}>
                      <Chip href={`/dictionary/${c.slug}`}>{c.title}</Chip>
                    </li>
                  ) : null;
                })}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CopyLinkButton />
                <Link href="/about#signers" className="text-sm text-secondary underline-offset-4 hover:underline">
                  Filmed by the Ziggy signers
                </Link>
              </div>

              {components.length > 0 ? (
                <div className="mt-8">
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-secondary">
                    Signs in this phrase
                  </p>
                  <ol className="mt-3 flex flex-wrap items-center gap-2">
                    {components.map((c, i) => (
                      <li key={c.id} className="flex items-center gap-2">
                        <Link
                          href={`/sign/${c.slug}`}
                          className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-ink shadow-card outline outline-1 -outline-offset-1 outline-divider transition-transform hover:-translate-y-px"
                        >
                          <span className="gloss">{c.display}</span>
                        </Link>
                        {i < components.length - 1 ? (
                          <ChevronRight size={14} className="text-divider" />
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        <Container narrow className="mt-16">
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              How to sign {sign.display.toLowerCase().replace(/\?$/, "")}
            </h2>
            <ol className="mt-6 space-y-4">
              {content.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-clay">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-[1.05rem] leading-relaxed text-ink">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {content.note || tip ? (
            <MascotNote title="Teacher's note">
              {content.note ? (
                <p>{content.note}</p>
              ) : tip ? (
                <p>
                  <strong>{tip.title}.</strong> {tip.text}
                </p>
              ) : null}
            </MascotNote>
          ) : null}

          <section className="mt-14" aria-labelledby="mistakes-heading">
            <h2 id="mistakes-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Common mistakes
            </h2>
            <ul className="mt-5 space-y-3">
              {content.mistakes.map((m, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-white px-5 py-4 leading-relaxed text-ink shadow-card outline outline-1 -outline-offset-1 outline-black/5"
                >
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {content.examples && content.examples.length > 0 ? (
            <section className="mt-14" aria-labelledby="examples-heading">
              <h2 id="examples-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Use it in a sentence
              </h2>
              <p className="mt-2 text-secondary">
                English sentences you can sign with <span className="gloss">{sign.display}</span>.
                In ASL the word order can shift and filler words drop away.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {content.examples.slice(0, 4).map((ex, i) => (
                  <li
                    key={i}
                    className="rounded-2xl bg-cream px-5 py-4 text-[1.02rem] font-medium text-ink"
                  >
                    “{ex}”
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>

        {related.length > 0 ? (
          <Container className="mt-20">
            <FadeIn>
              <SectionHeading
                eyebrow="Keep going"
                title={category ? `More ${category.title.toLowerCase()} signs` : "Related signs"}
                action={
                  category
                    ? { label: `All ${category.wordIds.length} signs`, href: `/dictionary/${category.slug}` }
                    : undefined
                }
              />
              <div className="mt-8">
                <SignGrid signs={related.map(toSignCardData)} categoryTitle={category?.title} />
              </div>
            </FadeIn>
          </Container>
        ) : null}

        <Container narrow className="mt-20">
          <AppCTA context={sign.display} />
        </Container>

        <Container narrow className="mt-20">
          <FAQ items={content.faq} title={`Questions about “${sign.display}”`} />
        </Container>

        <Container narrow className="mt-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/learn/${guide.slug}`}
              className="card-lift group rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-shadow">Guide</p>
              <p className="mt-1.5 text-lg font-bold leading-tight text-ink">{guide.shortTitle}</p>
              <p className="mt-1 line-clamp-2 text-sm text-secondary">{guide.description}</p>
            </Link>
            {posts[0] ? (
              <Link
                href={`/blog/${posts[0].slug}`}
                className="card-lift group rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-shadow">From the blog</p>
                <p className="mt-1.5 text-lg font-bold leading-tight text-ink">{posts[0].title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-secondary">{posts[0].description}</p>
              </Link>
            ) : null}
          </div>
        </Container>

        {prev || next ? (
          <Container className="mb-24 mt-16">
            <nav aria-label="Previous and next sign" className="grid gap-4 sm:grid-cols-2">
              {prev ? (
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-secondary">
                    <ChevronLeft size={14} /> Previous
                  </p>
                  <SignCard sign={toSignCardData(prev)} categoryTitle={category?.title} />
                </div>
              ) : (
                <div />
              )}
              {next ? (
                <div>
                  <p className="mb-2 flex items-center justify-end gap-1 text-xs font-bold uppercase tracking-[0.1em] text-secondary">
                    Next <ChevronRight size={14} />
                  </p>
                  <SignCard sign={toSignCardData(next)} categoryTitle={category?.title} />
                </div>
              ) : null}
            </nav>
          </Container>
        ) : (
          <div className="mb-24" />
        )}
      </main>
      <Footer />
    </>
  );
}

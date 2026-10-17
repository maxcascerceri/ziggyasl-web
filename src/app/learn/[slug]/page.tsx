import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCTA } from "@/components/AppCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/Icons";
import { PracticeWidget } from "@/components/learn/PracticeWidget";
import { TableOfContents } from "@/components/TableOfContents";
import { Breadcrumbs, Container, Eyebrow, JsonLd } from "@/components/ui";
import { getCategory } from "@/lib/catalog";
import { getGuide, LEARN_GUIDES } from "@/lib/learnGuides";
import { clipsFor, renderMdx } from "@/lib/mdx";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEARN_GUIDES.map((g) => ({ slug: g.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/learn/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: absoluteUrl(`/learn/${guide.slug}`),
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const compiled = await renderMdx("learn", guide.slug);
  if (!compiled) notFound();

  const category = guide.categoryId ? getCategory(guide.categoryId) : undefined;
  const clips = clipsFor(guide.signIds);
  const index = LEARN_GUIDES.findIndex((g) => g.slug === guide.slug);
  const nextGuide = LEARN_GUIDES[(index + 1) % LEARN_GUIDES.length];
  const url = absoluteUrl(`/learn/${guide.slug}`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: guide.title,
    description: guide.description,
    url,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: url,
    inLanguage: "en-US",
    about: clips.slice(0, 20).map((c) => ({ "@id": `${SITE_URL}/sign/${c.slug}#term` })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: absoluteUrl("/learn") },
      { "@type": "ListItem", position: 3, name: guide.shortTitle, item: url },
    ],
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <main className="flex-1 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, { label: guide.shortTitle }]} />
          <header className={`tint-${guide.tint} mt-6 rounded-[32px] bg-[var(--tint)] px-6 py-8 sm:px-10 sm:py-12`}>
            <div className="max-w-3xl">
              <Eyebrow tone="ink">
                Guide · {guide.minutes} min · {guide.signIds.length} signs on video
              </Eyebrow>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {guide.title}
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/80">{guide.description}</p>
              <p className="mt-5 text-sm font-medium text-ink/60">
                By {AUTHOR.name} · Updated {new Date(guide.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </header>
        </Container>

        <Container className="mt-12">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={compiled.headings} />
              </div>
            </aside>
            <article className="prose-ziggy max-w-3xl">{compiled.content}</article>
          </div>
        </Container>

        <Container narrow className="mt-8">
          <PracticeWidget clips={clips} title={`Practice: ${guide.shortTitle}`} />
        </Container>

        <Container narrow className="mt-12">
          <AppCTA context={guide.shortTitle} />
        </Container>

        <Container narrow className="mb-24 mt-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {category ? (
              <Link
                href={`/dictionary/${category.slug}`}
                className="card-lift group rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-shadow">Dictionary</p>
                <p className="mt-1.5 text-lg font-bold leading-tight text-ink">All {category.title.toLowerCase()} signs</p>
                <p className="mt-1 text-sm text-secondary">{category.wordIds.length} signs on video</p>
              </Link>
            ) : null}
            <Link
              href={`/learn/${nextGuide.slug}`}
              className="card-lift group rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
            >
              <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-brand-shadow">
                Next guide <ArrowRight size={12} />
              </p>
              <p className="mt-1.5 text-lg font-bold leading-tight text-ink">{nextGuide.shortTitle}</p>
              <p className="mt-1 line-clamp-2 text-sm text-secondary">{nextGuide.description}</p>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

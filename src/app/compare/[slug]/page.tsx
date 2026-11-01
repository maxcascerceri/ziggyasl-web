import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCTA } from "@/components/AppCTA";
import { CompareTable, Disclosure, SourcesAndTrademarks } from "@/components/compare/CompareParts";
import { FAQ, faqPageLd } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuickAnswer } from "@/components/QuickAnswer";
import { Breadcrumbs, Container, Eyebrow, JsonLd } from "@/components/ui";
import { CHECKED_AT, CHECKED_LABEL, COMPARISONS, getApp, getComparison } from "@/content/compare/apps";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return {
    title: { absolute: c.metaTitle },
    description: c.description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: { title: c.metaTitle, description: c.description, url: absoluteUrl(`/compare/${c.slug}`), type: "article" },
  };
}

export default async function ComparePage({ params }: Params) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();
  const them = getApp(c.competitor);
  const url = absoluteUrl(`/compare/${c.slug}`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: c.title,
    description: c.description,
    url,
    datePublished: CHECKED_AT,
    dateModified: CHECKED_AT,
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    inLanguage: "en-US",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Best ASL apps", item: absoluteUrl("/best-asl-apps") },
      { "@type": "ListItem", position: 3, name: c.title, item: url },
    ],
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[articleLd, faqPageLd(c.faq), breadcrumbLd]} />
      <main id="main" className="flex-1 pt-28 sm:pt-32">
        <Container narrow>
          <Breadcrumbs items={[{ label: "Best ASL apps", href: "/best-asl-apps" }, { label: c.title }]} />
          <header className="mt-8">
            <Eyebrow>Updated {CHECKED_LABEL} · By {AUTHOR.name}</Eyebrow>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {c.title}
            </h1>
          </header>

          <div className="mt-8">
            <QuickAnswer>{c.verdict}</QuickAnswer>
          </div>

          <article className="prose-ziggy mt-10">
            <Disclosure />

            <h2>Side by side</h2>
            <CompareTable head={["", "Ziggy", them.name]} rows={c.rows.map((r) => [r.label, r.ziggy, r.them])} />

            <h2>Where Ziggy is stronger</h2>
            <ul>
              {c.ziggyStronger.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}.</strong> {s.body}
                </li>
              ))}
            </ul>

            <h2>Where {them.name} is stronger</h2>
            <ul>
              {c.themStronger.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}.</strong> {s.body}
                </li>
              ))}
            </ul>

            <h2>Who should pick which</h2>
            <ul>
              {c.whoPicks.map((w) => (
                <li key={w.who}>
                  <strong>{w.who}:</strong> {w.pick}
                </li>
              ))}
            </ul>

            <p>
              Comparing more apps? See <Link href="/best-asl-apps">the best apps to learn sign language</Link>, or
              start free with the <Link href="/dictionary">ASL dictionary</Link>.
            </p>
          </article>

          <div className="mt-14">
            <FAQ items={c.faq} title="Frequently asked questions" />
          </div>

          <div className="prose-ziggy mt-14">
            <SourcesAndTrademarks sources={them.sources} />
          </div>
        </Container>

        <Container narrow className="mb-24 mt-16">
          <AppCTA />
        </Container>
      </main>
      <Footer />
    </>
  );
}

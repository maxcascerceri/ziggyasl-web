import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCTA } from "@/components/AppCTA";
import { CategoryCard } from "@/components/CategoryCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/Icons";
import { FadeIn } from "@/components/Motion";
import { SignGrid } from "@/components/SignCard";
import {
  Breadcrumbs,
  Container,
  Eyebrow,
  JsonLd,
  MascotNote,
  SectionHeading,
} from "@/components/ui";
import { allCategories, categorySigns, getCategory, toSignCardData } from "@/lib/catalog";
import { categoryCopy } from "@/content/categories";
import { guideForCategory } from "@/lib/learnGuides";
import { postsForCategory } from "@/lib/blog";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCategories().map((c) => ({ category: c.slug }));
}

type Params = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const cc = categoryCopy(category.id, category.title);
  const title = `${cc.seoTitle} (${category.wordIds.length} Signs on Video)`;
  const description = cc.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…";
  return {
    title,
    description,
    alternates: { canonical: `/dictionary/${category.slug}` },
    openGraph: { title, description, url: absoluteUrl(`/dictionary/${category.slug}`) },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const signs = categorySigns(category);
  const cc = categoryCopy(category.id, category.title);
  const guide = guideForCategory(category.id);
  const posts = postsForCategory(category.id);
  const url = absoluteUrl(`/dictionary/${category.slug}`);

  const all = allCategories();
  const index = all.findIndex((c) => c.id === category.id);
  const neighbors = [
    ...all.slice(index + 1, index + 4),
    ...all.slice(0, Math.max(0, 3 - (all.length - index - 1))),
  ].slice(0, 3);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#list`,
    name: cc.seoTitle,
    numberOfItems: signs.length,
    itemListElement: signs.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.display,
      url: absoluteUrl(`/sign/${s.slug}`),
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: cc.seoTitle,
    description: cc.intro,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${url}#list` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Dictionary", item: absoluteUrl("/dictionary") },
      { "@type": "ListItem", position: 3, name: category.title, item: url },
    ],
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[listLd, pageLd, breadcrumbLd]} />
      <main className="flex-1 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Dictionary", href: "/dictionary" },
              { label: category.title },
            ]}
          />
          <div className={`tint-${category.tint} mt-6 rounded-[32px] bg-[var(--tint)] px-6 py-8 sm:px-10 sm:py-12`}>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <CategoryIcon categoryId={category.id} size="lg" />
                <Eyebrow tone="ink">
                  {signs.length} {signs.length === 1 ? "sign" : "signs"} · {category.title}
                </Eyebrow>
              </div>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {cc.seoTitle}
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-ink/80">{cc.intro}</p>
              {guide ? (
                <Link
                  href={`/learn/${guide.slug}`}
                  className="cta-clay relative isolate mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink"
                >
                  Learn these in order
                  <ArrowRight size={18} className="text-brand" />
                </Link>
              ) : null}
            </div>
          </div>
        </Container>

        <Container className="mt-12">
          <SignGrid signs={signs.map(toSignCardData)} categoryTitle={category.title} priorityCount={8} />
        </Container>

        {cc.tip ? (
          <Container narrow>
            <MascotNote title="Teacher's tip">
              <p>{cc.tip}</p>
            </MascotNote>
          </Container>
        ) : null}

        <Container narrow className="mt-20">
          <AppCTA context={category.title} />
        </Container>

        {posts.length > 0 ? (
          <Container className="mt-20">
            <FadeIn>
              <SectionHeading eyebrow="Read next" title="Guides that use these signs" action={{ label: "All posts", href: "/blog" }} />
            </FadeIn>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className={`card-lift tint-${p.tint} block h-full rounded-[24px] bg-[var(--tint)] p-5`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/70">{p.minutes} min read</p>
                    <p className="mt-2 text-lg font-bold leading-tight text-ink">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        ) : null}

        <Container className="mb-24 mt-20">
          <FadeIn>
            <SectionHeading eyebrow="Keep browsing" title="Nearby categories" action={{ label: "All categories", href: "/dictionary" }} />
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {neighbors.map((c) => (
              <li key={c.id}>
                <CategoryCard category={c} />
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AppCTA } from "@/components/AppCTA";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FadeIn, RiseIn } from "@/components/Motion";
import { SearchButton } from "@/components/SearchCommand";
import { SignCard } from "@/components/SignCard";
import { SignVideo } from "@/components/SignVideo";
import { Container, Eyebrow, JsonLd, SectionHeading } from "@/components/ui";
import {
  allCategories,
  alphabetGroups,
  catalogMeta,
  getCategory,
  getSigns,
  primaryCategory,
  signOfTheDay,
  START_HERE_CATEGORY_IDS,
  toSignCardData,
} from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { signPosterURL, signVideoURL } from "@/lib/firebasePublic";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "ASL Dictionary: 700+ Sign Language Signs on Video",
  description:
    "Free American Sign Language dictionary. Search 700+ ASL signs and phrases, each filmed by a real signer and explained by a teacher. Browse by topic or A to Z.",
  alternates: { canonical: "/dictionary" },
  openGraph: {
    title: "ASL Dictionary: 700+ Sign Language Signs on Video | Ziggy",
    description:
      "Search 700+ ASL signs and phrases on real video, organized by topic and explained by teachers.",
    url: absoluteUrl("/dictionary"),
  },
};

export default function DictionaryPage() {
  const categories = allCategories();
  const startHere = START_HERE_CATEGORY_IDS.map((id) => getCategory(id)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const rest = categories.filter((c) => !START_HERE_CATEGORY_IDS.includes(c.id));
  const today = signOfTheDay();
  const todayCategory = primaryCategory(today);
  const groups = alphabetGroups();
  const popular = getSigns([
    "hello", "thankyou", "iloveyou", "please", "sorry", "yes", "no", "help",
    "what", "where", "happy", "friend",
  ]);

  const setLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/dictionary#set`,
    name: `${SITE_NAME} ASL Dictionary`,
    url: absoluteUrl("/dictionary"),
    description: metadata.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    hasDefinedTerm: categories.flatMap((c) =>
      c.wordIds.slice(0, 3).map((id) => ({ "@id": `${SITE_URL}/sign/${id}#term` })),
    ).slice(0, 60),
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/dictionary"),
    name: "ASL Dictionary",
    url: absoluteUrl("/dictionary"),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: categories.map((c) => ({
      "@type": "WebPage",
      name: `ASL ${c.title} Signs`,
      url: absoluteUrl(`/dictionary/${c.slug}`),
    })),
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[setLd, collectionLd]} />
      <main className="flex-1 pt-32 sm:pt-36">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, var(--soft) 0%, rgba(204,227,252,0.35) 45%, transparent 70%)",
            }}
          />
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <RiseIn>
                <Eyebrow>{copy.dictionary.eyebrow}</Eyebrow>
              </RiseIn>
              <RiseIn delay={0.06}>
                <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  {copy.dictionary.title}
                </h1>
              </RiseIn>
              <RiseIn delay={0.12}>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-secondary">
                  {copy.dictionary.subtitle}
                </p>
              </RiseIn>
              <RiseIn delay={0.18}>
                <div className="mt-8">
                  <SearchButton variant="field" placeholder={copy.dictionary.searchPlaceholder} />
                </div>
                <ul className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                  {popular.slice(0, 6).map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/sign/${s.slug}`}
                        className="inline-flex min-h-9 items-center rounded-full bg-white px-3.5 font-semibold text-secondary outline outline-1 -outline-offset-1 outline-divider transition-colors hover:text-ink"
                      >
                        {s.display}
                      </Link>
                    </li>
                  ))}
                </ul>
              </RiseIn>
            </div>
          </Container>
        </section>

        <Container className="mt-20">
          <FadeIn>
            <div className="grid items-center gap-8 rounded-[32px] bg-white p-6 shadow-card outline outline-1 -outline-offset-1 outline-black/5 sm:p-8 lg:grid-cols-[1fr_1fr]">
              <SignVideo
                src={signVideoURL(today.id)}
                poster={signPosterURL(today.id)}
                label={`Video of the ASL sign for ${today.display}`}
                priority
              />
              <div>
                <Eyebrow>{copy.dictionary.signOfTheDay}</Eyebrow>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {today.display}
                  {today.aliases.length ? (
                    <span className="text-secondary"> / {today.aliases.join(" / ")}</span>
                  ) : null}
                </h2>
                <p className="mt-3 text-secondary">
                  {todayCategory ? `From ${todayCategory.title}. ` : ""}
                  One new sign a day is enough. Watch it, sign it three times, and come back tomorrow.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/sign/${today.slug}`}
                    className="cta-clay relative isolate inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-base font-semibold text-white"
                  >
                    Learn this sign
                  </Link>
                  {todayCategory ? (
                    <Link
                      href={`/dictionary/${todayCategory.slug}`}
                      className="inline-flex min-h-12 items-center rounded-full bg-cream px-6 text-base font-semibold text-ink outline outline-1 -outline-offset-1 outline-divider"
                    >
                      More {todayCategory.title.toLowerCase()}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>

        <Container className="mt-24">
          <FadeIn>
            <SectionHeading
              eyebrow={copy.dictionary.startHere}
              title="The signs beginners search for first"
              subtitle="Greetings, replies, pronouns, and question words cover most of a first conversation. Start with these."
            />
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {startHere.map((c, i) => (
              <li key={c.id}>
                <FadeIn delay={Math.min(i, 4) * 0.05}>
                  <CategoryCard category={c} />
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>

        <Container className="mt-24">
          <FadeIn>
            <SectionHeading
              eyebrow="Popular"
              title="Most searched signs"
            />
          </FadeIn>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {popular.map((s) => (
              <li key={s.id}>
                <SignCard sign={toSignCardData(s)} categoryTitle={primaryCategory(s)?.title} />
              </li>
            ))}
          </ul>
        </Container>

        <Container className="mt-24">
          <FadeIn>
            <SectionHeading
              eyebrow={copy.dictionary.browseAll}
              title={`All ${categories.length} categories`}
              subtitle={`${catalogMeta.counts.signs} signs and phrases, grouped the way you'd actually use them.`}
            />
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((c) => (
              <li key={c.id}>
                <CategoryCard category={c} />
              </li>
            ))}
          </ul>
        </Container>

        <Container className="mt-24">
          <FadeIn>
            <SectionHeading eyebrow={copy.dictionary.aToZ} title="Every sign, alphabetically" />
          </FadeIn>
          <nav aria-label="Jump to letter" className="rail mt-6 flex gap-1.5 overflow-x-auto pb-2">
            {groups.map((g) => (
              <a
                key={g.letter}
                href={`#letter-${g.letter === "#" ? "num" : g.letter}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-ink outline outline-1 -outline-offset-1 outline-divider transition-colors hover:bg-soft"
              >
                {g.letter}
              </a>
            ))}
          </nav>
          <div className="mt-8 columns-2 gap-8 sm:columns-3 lg:columns-4">
            {groups.map((g) => (
              <section
                key={g.letter}
                id={`letter-${g.letter === "#" ? "num" : g.letter}`}
                className="mb-8 break-inside-avoid scroll-mt-28"
              >
                <h3 className="text-2xl font-bold text-brand">{g.letter}</h3>
                <ul className="mt-2 space-y-1">
                  {g.signs.map((s) => (
                    <li key={s.id}>
                      <Link href={`/sign/${s.slug}`} className="az-link">
                        {s.display}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>

        <Container narrow className="mb-24 mt-24">
          <AppCTA />
        </Container>
      </main>
      <Footer />
    </>
  );
}

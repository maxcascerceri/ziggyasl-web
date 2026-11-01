import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AppCTA } from "@/components/AppCTA";
import { CompareTable, Disclosure, SourcesAndTrademarks } from "@/components/compare/CompareParts";
import { FAQ, faqPageLd } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuickAnswer } from "@/components/QuickAnswer";
import { Breadcrumbs, Container, Eyebrow, JsonLd } from "@/components/ui";
import { APPS, BEST_APPS_FAQ, CHECKED_AT, CHECKED_LABEL } from "@/content/compare/apps";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

const PATH = "/best-asl-apps";
const TITLE = "The Best Apps to Learn Sign Language in 2026";
const DESCRIPTION =
  "We compared the top ASL apps, Ziggy, Lingvano, The ASL App, SignSchool, and Hands On ASL, on video, structure, and daily practice. Here's which one to pick.";
const QUICK_ANSWER =
  "Our pick for the best app to learn American Sign Language as a beginner is Ziggy: short video lessons with real signers, a learning path that always knows what's next, and spaced review that makes signs stick. Lingvano is a strong pick for a longer structured course, The ASL App is the best one-time purchase, and SignSchool is the best free option. Duolingo does not teach sign language.";

export const metadata: Metadata = {
  title: { absolute: "Best Apps to Learn Sign Language (ASL) in 2026 | Ziggy" },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "article" },
};

export default function BestAslAppsPage() {
  const url = absoluteUrl(PATH);
  const sources = [...new Set(APPS.filter((a) => a.id !== "ziggy").flatMap((a) => a.sources))];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: TITLE,
    description: DESCRIPTION,
    url,
    datePublished: CHECKED_AT,
    dateModified: CHECKED_AT,
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    inLanguage: "en-US",
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best apps to learn sign language",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: APPS.length,
    itemListElement: APPS.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.name,
      url: a.url,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: absoluteUrl("/learn") },
      { "@type": "ListItem", position: 3, name: "Best ASL apps", item: url },
    ],
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[articleLd, listLd, faqPageLd(BEST_APPS_FAQ), breadcrumbLd]} />
      <main id="main" className="flex-1 pt-28 sm:pt-32">
        <Container narrow>
          <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, { label: "Best ASL apps" }]} />
          <header className="mt-8">
            <Eyebrow>Updated {CHECKED_LABEL} · By {AUTHOR.name}</Eyebrow>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {TITLE}
            </h1>
          </header>

          <div className="mt-8">
            <QuickAnswer>{QUICK_ANSWER}</QuickAnswer>
          </div>

          <article className="prose-ziggy mt-10">
            <Disclosure />

            <h2>At a glance</h2>
            <CompareTable
              head={["App", "Best for", "How it works", "Platforms"]}
              rows={[
                ...APPS.map((a) => [a.name, a.bestFor, a.howItWorks, a.platforms]),
                ["Duolingo", "—", "No sign language course", "—"],
              ]}
            />

            <h2>How we judged them</h2>
            <ul>
              <li><strong>Real video of real signers</strong>, with handshape, movement, and face all visible</li>
              <li><strong>A clear path</strong>, so you always know what to learn next</li>
              <li><strong>Review</strong> that brings signs back before you forget them</li>
              <li><strong>Fits a few minutes a day</strong></li>
              <li><strong>A way to try it before you pay</strong></li>
            </ul>

            {APPS.map((a, i) => (
              <Fragment key={a.id}>
                <h2>
                  {i + 1}. {a.name}: {a.award}
                </h2>
                {a.summary.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <ul>
                  <li><strong>Good:</strong> {a.good.join("; ")}</li>
                  <li><strong>Keep in mind:</strong> {a.keepInMind.join("; ")}</li>
                  <li><strong>How it works:</strong> {a.howItWorks} · {a.platforms}</li>
                </ul>
                {a.id === "lingvano" ? (
                  <p><Link href="/compare/ziggy-vs-lingvano">Ziggy vs Lingvano, side by side</Link></p>
                ) : null}
                {a.id === "the-asl-app" ? (
                  <p><Link href="/compare/ziggy-vs-the-asl-app">Ziggy vs The ASL App, side by side</Link></p>
                ) : null}
              </Fragment>
            ))}

            <h2>What about Duolingo?</h2>
            <p>
              Duolingo does not offer American Sign Language or any other sign language. If you like
              Duolingo&apos;s short lessons and streaks, Ziggy is the closest match, built only for ASL.{" "}
              <Link href="/blog/does-duolingo-have-sign-language">Does Duolingo have sign language?</Link>
            </p>

            <h2>App or class?</h2>
            <p>
              Both, if you can. An app is the easiest way to learn vocabulary and practice every day. A
              class or tutor, ideally with a Deaf teacher, gives you what no app can: live feedback on
              your own signing and real conversation. Most learners do best with daily app practice plus
              a weekly class, meetup, or Deaf community event.
            </p>

            <h2>How to choose</h2>
            <ul>
              <li><strong>A daily habit with a clear path:</strong> Ziggy</li>
              <li><strong>The biggest structured course, with camera practice:</strong> Lingvano</li>
              <li><strong>Pay once:</strong> The ASL App</li>
              <li>
                <strong>Nothing to spend yet:</strong> SignSchool, plus Ziggy&apos;s free{" "}
                <Link href="/dictionary">dictionary</Link> and <Link href="/learn">guides</Link>
              </li>
              <li>
                <strong>Just the alphabet:</strong> Hands On ASL, or our{" "}
                <Link href="/learn/asl-alphabet">ASL alphabet guide</Link>
              </li>
            </ul>
          </article>

          <div className="mt-14">
            <FAQ items={BEST_APPS_FAQ} title="Frequently asked questions" />
          </div>

          <div className="prose-ziggy mt-14">
            <SourcesAndTrademarks sources={sources} />
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

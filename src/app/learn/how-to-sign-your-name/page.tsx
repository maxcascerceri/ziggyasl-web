import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AppCTA } from "@/components/AppCTA";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NameSpeller, NameSpellerFromUrl, type LetterClip } from "@/components/learn/NameSpeller";
import { SignClip } from "@/components/learn/SignClip";
import { StickerDrift } from "@/components/StickerDrift";
import { Breadcrumbs, Container, Eyebrow, JsonLd, MascotNote } from "@/components/ui";
import { getCategory, getSigns } from "@/lib/catalog";
import { signThumbURL, signVideoURL } from "@/lib/firebasePublic";
import { clipsFor } from "@/lib/mdx";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const PATH = "/learn/how-to-sign-your-name";
const TITLE = "How to Sign Your Name in ASL: Free Fingerspelling Tool";
const DESCRIPTION =
  "Type your name and watch it fingerspelled in American Sign Language, letter by letter, on real video. Plus how to introduce yourself and what a name sign is.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "article" },
};

const STEPS = [
  {
    name: "Sign MY NAME",
    text: "Tap your chest with a flat hand for MY, then tap the two fingers of one H hand on top of the other for NAME.",
  },
  {
    name: "Fingerspell your name",
    text: "Hold your dominant hand at shoulder height, palm out, and spell each letter at a steady rhythm without bouncing.",
  },
  {
    name: "Finish with NICE TO MEET YOU",
    text: "Slide one flat hand across the other for NICE, bring two index fingers together for MEET, then point to the person for YOU.",
  },
];

const FAQS: FAQItem[] = [
  {
    q: "How do I sign my name in ASL?",
    a: "Sign MY NAME, then fingerspell your name one letter at a time with your dominant hand held at shoulder height, palm facing out. Type your name into the tool above to see every letter on video.",
  },
  {
    q: "Can I make up my own name sign?",
    a: "No. In Deaf culture a name sign is given to you by a Deaf person, usually once they know you. Until then, your fingerspelled name is your name, and that is completely normal.",
  },
  {
    q: "How do you fingerspell double letters, like the LL in Molly?",
    a: "Sign the letter once, then slide your hand slightly to the side for the second one. For letters with a closed handshape, a small bounce in place works too.",
  },
  {
    q: "Which hand do I fingerspell with?",
    a: "Your dominant hand: right hand if you are right-handed, left if you are left-handed. Keep using the same hand so your spelling stays smooth and easy to read.",
  },
  {
    q: "How do I ask someone's name in ASL?",
    a: "Sign YOUR NAME WHAT? with your eyebrows down, the facial expression that marks a WH-question. ASL puts the question word at the end.",
  },
  {
    q: "How can I fingerspell my name faster?",
    a: "Practice it as one shape that flows, not as separate letters. Spell it slowly ten times a day for a week, then speed up. Rhythm matters more than speed.",
  },
];

export default function SignYourNamePage() {
  const alphabet = getCategory("alphabet");
  const letters = getSigns(alphabet?.wordIds ?? []);
  const clips: Record<string, LetterClip> = {};
  for (const s of letters) {
    const letter = s.display.replace(/^Letter\s+/i, "").trim().toUpperCase();
    if (!/^[A-Z]$/.test(letter)) continue;
    clips[letter] = {
      letter,
      slug: s.slug,
      video: signVideoURL(s.id),
      thumb: signThumbURL(s.id),
    };
  }
  const [myNameIs, niceToMeetYou, whatsYourName, nameSign] = clipsFor([
    "mynameis",
    "nicetomeetyou",
    "whatisyourname",
    "namesign",
  ]);
  const url = absoluteUrl(PATH);

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to sign your name in ASL",
    description: DESCRIPTION,
    url,
    totalTime: "PT1M",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: absoluteUrl("/learn") },
      { "@type": "ListItem", position: 3, name: "Sign your name", item: url },
    ],
  };

  return (
    <>
      <Header solid />
      <JsonLd data={[howToLd, faqLd, breadcrumbLd]} />
      <main id="main" className="flex-1 pt-28 sm:pt-32">
        <section className="relative">
          <StickerDrift
            items={[
              { name: "spell", top: "40%", side: "left", inset: "calc(50% - 30rem)", size: 84, rotate: -9, depth: 0.5, from: "lg" },
              { name: "introductions", top: "26%", side: "right", inset: "calc(50% - 30rem)", size: 80, rotate: 8, depth: 0.6, from: "lg" },
            ]}
          />
          <Container>
            <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, { label: "Sign your name" }]} />
            <div className="mx-auto mt-8 max-w-2xl text-center">
              <Eyebrow>Free fingerspelling tool</Eyebrow>
              <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                How to sign your name in ASL
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-secondary">
                Type your name and watch it fingerspelled in American Sign Language, letter by
                letter, on real video. Then learn the three signs you need to introduce yourself.
              </p>
            </div>
          </Container>
        </section>

        <Container className="mt-10">
          <Suspense fallback={<NameSpeller clips={clips} />}>
            <NameSpellerFromUrl clips={clips} />
          </Suspense>
        </Container>

        <Container narrow className="mt-20">
          <section aria-labelledby="introduce">
            <h2 id="introduce" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Introduce yourself in three signs
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-secondary">
              In ASL you don&apos;t just spell your name; you introduce it. The whole thing takes
              about five seconds: MY NAME, your fingerspelled name, then NICE TO MEET YOU.
            </p>
            <ol className="mt-8 space-y-8">
              {STEPS.map((step, i) => {
                const clip = i === 0 ? myNameIs : i === 2 ? niceToMeetYou : null;
                return (
                  <li key={step.name} className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
                    <span className="cta-clay relative isolate inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-base font-extrabold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-ink">{step.name}</h3>
                      <p className="mt-2 leading-relaxed text-secondary">{step.text}</p>
                      {clip ? (
                        <div className="mt-4 max-w-md">
                          <SignClip clip={clip} size="md" />
                        </div>
                      ) : (
                        <p className="mt-3 text-sm font-semibold text-ink/70">
                          Use the tool above to practice your own letters.
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </Container>

        <Container narrow className="mt-20">
          <section aria-labelledby="tips">
            <h2 id="tips" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Fingerspelling tips that make your name easy to read
            </h2>
            <ul className="mt-6 space-y-4 text-lg leading-relaxed text-secondary">
              <li>
                <strong className="text-ink">Stay in one spot.</strong> Your hand stays beside your
                shoulder for the whole name. Don&apos;t drift across your body as you spell.
              </li>
              <li>
                <strong className="text-ink">Rhythm over speed.</strong> An even pace is easier to
                read than a fast one. Pause briefly between first and last name.
              </li>
              <li>
                <strong className="text-ink">Don&apos;t bounce.</strong> Bouncing on every letter is
                the most common beginner habit, and it makes letters hard to tell apart.
              </li>
              <li>
                <strong className="text-ink">Mouth the word, not the letters.</strong> Mouth your
                name the way you&apos;d say it, not &quot;M, A, X.&quot;
              </li>
            </ul>
          </section>
        </Container>

        <Container narrow className="mt-20">
          <section aria-labelledby="name-sign">
            <h2 id="name-sign" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              What is a name sign?
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
              <div className="space-y-4 text-lg leading-relaxed text-secondary">
                <p>
                  A name sign is a single sign that stands in for someone&apos;s name, so friends
                  don&apos;t have to fingerspell it every time. It often uses your first letter
                  plus something about you.
                </p>
                <p>
                  Name signs are given by Deaf people, not chosen by yourself. Making up your own is
                  considered a faux pas. Fingerspell your name until someone gives you one.
                </p>
              </div>
              {nameSign ? <SignClip clip={nameSign} caption="NAME SIGN" size="md" /> : null}
            </div>
            <MascotNote title="Ziggy's tip">
              To ask someone&apos;s name, sign YOUR NAME WHAT? with your eyebrows pulled down.
              {whatsYourName ? (
                <>
                  {" "}
                  <Link href={`/sign/${whatsYourName.slug}`} className="font-extrabold text-brand-text underline decoration-brand/30 underline-offset-4">
                    Watch it on video
                  </Link>
                  .
                </>
              ) : null}
            </MascotNote>
          </section>
        </Container>

        <Container narrow className="mt-20">
          <section aria-labelledby="alphabet">
            <h2 id="alphabet" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Every letter of the ASL alphabet
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-secondary">
              Tap a letter to see its handshape up close, or work through the full{" "}
              <Link href="/learn/asl-alphabet" className="font-extrabold text-brand-text underline decoration-brand/30 underline-offset-4">
                ASL alphabet guide
              </Link>
              .
            </p>
            <ul className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-9 sm:gap-3">
              {Object.values(clips).map((c) => (
                <li key={c.letter}>
                  <Link
                    href={`/sign/${c.slug}`}
                    aria-label={`ASL letter ${c.letter}`}
                    className="card-lift flex aspect-square items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-ink outline outline-1 -outline-offset-1 outline-black/5"
                  >
                    {c.letter}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>

        <Container narrow className="mt-20">
          <FAQ items={FAQS} title="Questions about signing your name" />
        </Container>

        <Container narrow className="mb-24 mt-16">
          <AppCTA context="fingerspelling" />
        </Container>
      </main>
      <Footer />
    </>
  );
}

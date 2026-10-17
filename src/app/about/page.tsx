import type { Metadata } from "next";
import Link from "next/link";
import { AppCTA } from "@/components/AppCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FadeIn, RiseIn } from "@/components/Motion";
import { Container, Eyebrow, JsonLd, MascotNote } from "@/components/ui";
import { catalogMeta } from "@/lib/catalog";
import { links } from "@/lib/links";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Ziggy ASL: Who Makes the Dictionary and How",
  description:
    "Ziggy is an ASL learning app and free video dictionary. Meet the signers behind the clips, read our editorial standards, and learn how we review every sign.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Ziggy ASL",
    description: "The team, the signers, and the editorial standards behind the Ziggy ASL dictionary and guides.",
    url: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  // Site-level credits. Per-clip attribution isn't tracked reliably, so we credit the team, not each sign.
  const signers = ["Jared", "Elijah", "Victoria", "Ariel"];

  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": absoluteUrl("/about"),
    url: absoluteUrl("/about"),
    name: "About Ziggy ASL",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <Header solid />
      <JsonLd data={ld} />
      <main className="flex-1 pt-32 sm:pt-36">
        <Container narrow>
          <RiseIn>
            <Eyebrow>About</Eyebrow>
          </RiseIn>
          <RiseIn delay={0.06}>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              A friendly way into ASL, built on real signers
            </h1>
          </RiseIn>
          <RiseIn delay={0.12}>
            <p className="mt-5 text-pretty text-xl leading-relaxed text-secondary">
              Ziggy started as an app for learning American Sign Language a few minutes a day. This
              site opens up the same filmed dictionary, {catalogMeta.counts.signs} signs and phrases
              across {catalogMeta.counts.categories} categories, to anyone with a browser, for free.
            </p>
          </RiseIn>
        </Container>

        <Container narrow className="prose-ziggy mt-14">
          <FadeIn>
            <h2>What Ziggy is</h2>
            <p>
              Ziggy is a mobile app for iOS and Android that teaches ASL through short video lessons,
              recognition drills, and spaced review, with a small, encouraging mascot who is glad you
              showed up. The <Link href="/dictionary">dictionary</Link> and{" "}
              <Link href="/learn">guides</Link> on this site use the same video clips as the app.
              Nothing here is stock footage or animation.
            </p>

            <h2 id="signers">Who signs the clips</h2>
            <p>
              Every clip was filmed with a signer in front of a camera, one sign at a time, and
              re-filmed when a take was unclear. The dictionary is signed by our four signers:
            </p>
            <ul>
              {signers.map((name) => (
                <li key={name}>
                  <strong>{name}</strong>
                </li>
              ))}
            </ul>
            <p>
              ASL has regional and generational variation,
              just like spoken languages, so you may see small differences between our clips and the
              way a signer in your area produces a sign. Where a common variant exists, we try to
              say so in the written notes.
            </p>

            <h2>Who writes the words</h2>
            <p>
              Guides, blog posts, sign explanations, and category intros are written and reviewed by
              the {AUTHOR.name}. We write the way a good teacher talks in a first-semester class:
              plainly, with the reason behind each rule, and without pretending ASL is English on the
              hands. We do not make claims about individual credentials, and we do not use medical
              or legal framing around deafness.
            </p>
          </FadeIn>

          <MascotNote title="Our editorial standards">
            <ul className="list-disc space-y-2 pl-5">
              <li>Every sign we describe links to a real filmed clip. If we have not filmed it, we do not describe it.</li>
              <li>We describe handshape, location, and movement only when we are confident about the common form. Generated baseline text on newer pages says less rather than guessing.</li>
              <li>Facial expression and grammar notes follow mainstream ASL linguistics and classroom practice.</li>
              <li>Deaf culture content is written to center Deaf perspectives and is revised when community members tell us we got something wrong.</li>
              <li>Pages carry a last-updated date. When a clip or explanation is corrected, the date changes.</li>
            </ul>
          </MascotNote>

          <FadeIn>
            <h2>Corrections and contact</h2>
            <p>
              If a clip looks wrong, an explanation is off, or you would sign something differently in
              your community, we want to hear it. Email{" "}
              <a href={links.contact}>support@ziggyasl.com</a> with the sign page link and what you
              would change. We read everything.
            </p>

            <h2>How the site is built</h2>
            <p>
              The dictionary is exported directly from the app&apos;s sign catalog, so the web and the app
              never drift apart. Video is served as small H.264 clips with a poster frame, muted
              autoplay, and a half-speed control. Pages are prerendered so they load fast on a phone
              and are readable by search engines, with structured data for each video, term, and
              question.
            </p>
          </FadeIn>
        </Container>

        <Container narrow className="mb-24 mt-20">
          <AppCTA />
        </Container>
      </main>
      <Footer />
    </>
  );
}

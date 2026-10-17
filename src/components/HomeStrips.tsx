import Link from "next/link";
import { CategoryCard } from "./CategoryCard";
import { ArrowRight } from "./Icons";
import { FadeIn } from "./Motion";
import { SignCard } from "./SignCard";
import { SignVideo } from "./SignVideo";
import { Container, Eyebrow, SectionHeading } from "./ui";
import { copy } from "@/lib/copy";
import {
  catalogMeta,
  getCategory,
  getSigns,
  primaryCategory,
  signOfTheDay,
  START_HERE_CATEGORY_IDS,
  toSignCardData,
} from "@/lib/catalog";
import { signPosterURL, signVideoURL } from "@/lib/firebasePublic";
import { LEARN_GUIDES } from "@/lib/learnGuides";
import { BLOG_POSTS } from "@/lib/blog";

const HOME_GUIDE_SLUGS = ["asl-alphabet", "asl-greetings", "basic-asl-phrases", "asl-numbers"];

/** Dictionary teaser: sign of the day + popular signs + start-here categories. */
export function DictionaryStrip() {
  const today = signOfTheDay();
  const todayCategory = primaryCategory(today);
  const popular = getSigns(["hello", "thankyou", "iloveyou", "please", "sorry", "help"]);
  const startHere = START_HERE_CATEGORY_IDS.slice(0, 4)
    .map((id) => getCategory(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow={copy.home.dictionary.eyebrow}
            title={copy.home.dictionary.title}
            subtitle={copy.home.dictionary.subtitle}
            action={{ label: copy.home.dictionary.cta, href: "/dictionary" }}
          />
        </FadeIn>

        <FadeIn>
          <div className="mt-10 grid items-center gap-8 rounded-[32px] bg-white p-6 shadow-card outline outline-1 -outline-offset-1 outline-black/5 sm:p-8 lg:grid-cols-[1fr_1fr]">
            <SignVideo
              src={signVideoURL(today.id)}
              poster={signPosterURL(today.id)}
              label={`Video of the ASL sign for ${today.display}`}
            />
            <div>
              <Eyebrow>{copy.dictionary.signOfTheDay}</Eyebrow>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {today.display}
                {today.aliases.length ? (
                  <span className="text-secondary"> / {today.aliases.join(" / ")}</span>
                ) : null}
              </h3>
              <p className="mt-3 text-secondary">
                {todayCategory ? `From ${todayCategory.title}. ` : ""}
                One of {catalogMeta.counts.signs} signs filmed by real signers. New one every day.
              </p>
              <Link
                href={`/sign/${today.slug}`}
                className="cta-clay relative isolate mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-white"
              >
                Learn this sign <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </FadeIn>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {popular.map((s) => (
            <li key={s.id}>
              <SignCard sign={toSignCardData(s)} categoryTitle={primaryCategory(s)?.title} />
            </li>
          ))}
        </ul>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {startHere.map((c) => (
            <li key={c.id}>
              <CategoryCard category={c} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function LearnStrip() {
  const guides = HOME_GUIDE_SLUGS.map((s) => LEARN_GUIDES.find((g) => g.slug === s)!).filter(Boolean);
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow={copy.home.learn.eyebrow}
            title={copy.home.learn.title}
            subtitle={copy.home.learn.subtitle}
            action={{ label: copy.home.learn.cta, href: "/learn" }}
          />
        </FadeIn>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g, i) => (
            <li key={g.slug}>
              <FadeIn delay={i * 0.05} className="h-full">
                <Link
                  href={`/learn/${g.slug}`}
                  className={`card-lift tint-${g.tint} group flex h-full flex-col rounded-[24px] bg-[var(--tint)] p-5`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm font-bold text-ink">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-lg font-bold leading-tight text-ink">{g.shortTitle}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-ink/70">{g.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-ink">
                    {g.minutes} min <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function BlogStrip() {
  const posts = BLOG_POSTS.slice(0, 3);
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow={copy.home.blog.eyebrow}
            title={copy.home.blog.title}
            action={{ label: copy.home.blog.cta, href: "/blog" }}
          />
        </FadeIn>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <FadeIn delay={i * 0.05} className="h-full">
                <Link
                  href={`/blog/${p.slug}`}
                  className="card-lift group flex h-full flex-col rounded-[24px] bg-white p-5 outline outline-1 -outline-offset-1 outline-black/5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-shadow">{p.minutes} min read</p>
                  <p className="mt-2 text-lg font-bold leading-tight text-ink">{p.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-secondary">{p.description}</p>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

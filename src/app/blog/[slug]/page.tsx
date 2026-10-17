import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCTA } from "@/components/AppCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowRight } from "@/components/Icons";
import { SignGrid } from "@/components/SignCard";
import { TableOfContents } from "@/components/TableOfContents";
import { Breadcrumbs, Container, Eyebrow, JsonLd, SectionHeading } from "@/components/ui";
import { BLOG_POSTS, getPost } from "@/lib/blog";
import { getSigns, toSignCardData } from "@/lib/catalog";
import { renderMdx } from "@/lib/mdx";
import { absoluteUrl, AUTHOR, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const compiled = await renderMdx("blog", post.slug);
  if (!compiled) notFound();

  const signs = getSigns(post.signIds).slice(0, 8);
  const index = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const more = [BLOG_POSTS[(index + 1) % BLOG_POSTS.length], BLOG_POSTS[(index + 2) % BLOG_POSTS.length]];
  const url = absoluteUrl(`/blog/${post.slug}`);

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": absoluteUrl("/blog") },
    mainEntityOfPage: url,
    inLanguage: "en-US",
    keywords: post.keyword,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const date = new Date(post.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Header solid />
      <JsonLd data={[ld, breadcrumbLd]} />
      <main className="flex-1 pt-28 sm:pt-32">
        <Container narrow>
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
          <header className="mt-8">
            <Eyebrow>
              {post.minutes} min read · {date}
            </Eyebrow>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-pretty text-xl leading-relaxed text-secondary">{post.description}</p>
            <p className="mt-5 flex items-center gap-3 text-sm font-medium text-secondary">
              <Image src="/brand/app-icon.png" alt="" width={32} height={32} sizes="32px" className="h-8 w-8 rounded-lg" />
              By <Link href="/about" className="font-semibold text-ink">{AUTHOR.name}</Link>
            </p>
          </header>
        </Container>

        <Container className="mt-12">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={compiled.headings} />
              </div>
            </aside>
            <article className="prose-ziggy mx-auto w-full max-w-3xl">{compiled.content}</article>
            <div className="hidden lg:block" />
          </div>
        </Container>

        {signs.length > 0 ? (
          <Container className="mt-20">
            <SectionHeading eyebrow="Signs in this post" title="Watch every sign we mentioned" action={{ label: "Open the dictionary", href: "/dictionary" }} />
            <div className="mt-8">
              <SignGrid signs={signs.map(toSignCardData)} />
            </div>
          </Container>
        ) : null}

        <Container narrow className="mt-20">
          <AppCTA />
        </Container>

        <Container className="mb-24 mt-20">
          <SectionHeading eyebrow="Keep reading" title="More from the blog" action={{ label: "All posts", href: "/blog" }} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className={`card-lift tint-${p.tint} group flex h-full flex-col rounded-[24px] bg-[var(--tint)] p-6`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/60">{p.minutes} min read</p>
                  <p className="mt-2 text-xl font-bold leading-tight text-ink">{p.title}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-ink">
                    Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}

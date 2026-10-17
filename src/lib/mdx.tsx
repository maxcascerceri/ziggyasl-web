// MDX rendering for guides and blog posts. Content files live under
// src/content/{learn,blog}/{slug}.mdx. Custom components let authors drop a
// sign clip, a clip grid, a practice drill, or a teacher note into prose.

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { SignClip, SignSequence, type ClipData } from "@/components/learn/SignClip";
import { PracticeWidget } from "@/components/learn/PracticeWidget";
import { MascotNote } from "@/components/ui";
import { getSign, getSigns } from "./catalog";
import { signPosterURL, signVideoURL } from "./firebasePublic";

export function clipFor(id: string): ClipData | null {
  const sign = getSign(id);
  if (!sign) return null;
  return {
    id: sign.id,
    slug: sign.slug,
    display: sign.display,
    aliases: sign.aliases,
    video: signVideoURL(sign.id),
    poster: signPosterURL(sign.id),
  };
}

export function clipsFor(ids: string[]): ClipData[] {
  return getSigns(ids).map((s) => clipFor(s.id)!).filter(Boolean);
}

function Sign({ id, caption, size }: { id: string; caption?: string; size?: "sm" | "md" | "lg" }) {
  const clip = clipFor(id);
  if (!clip) return null;
  return (
    <div className="my-8 max-w-md">
      <SignClip clip={clip} caption={caption} size={size ?? "md"} />
    </div>
  );
}

function Signs({ ids, columns }: { ids: string; columns?: 2 | 3 | 4 }) {
  const clips = clipsFor(ids.split(",").map((s) => s.trim()).filter(Boolean));
  return <SignSequence clips={clips} columns={columns ?? 3} />;
}

function Practice({ ids, title }: { ids: string; title?: string }) {
  const clips = clipsFor(ids.split(",").map((s) => s.trim()).filter(Boolean));
  return <PracticeWidget clips={clips} title={title} />;
}

function Note({ title, children }: { title?: string; children: ReactNode }) {
  return <MascotNote title={title ?? "Teacher's note"}>{children}</MascotNote>;
}

/** Inline link to a sign page by id: <S id="hello" /> renders "Hello". */
function S({ id, text }: { id: string; text?: string }) {
  const sign = getSign(id);
  if (!sign) return <span className="gloss">{text ?? id}</span>;
  return (
    <Link href={`/sign/${sign.slug}`} className="gloss">
      {text ?? sign.display}
    </Link>
  );
}

function Gloss({ children }: { children: ReactNode }) {
  return <span className="gloss">{children}</span>;
}

export const mdxComponents = {
  Sign,
  Signs,
  Practice,
  Note,
  S,
  Gloss,
  a: ({ href = "", children }: { href?: string; children?: ReactNode }) =>
    href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
};

export type Compiled = {
  content: ReactNode;
  frontmatter: Record<string, unknown>;
  headings: { id: string; text: string; level: 2 | 3 }[];
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(source: string): Compiled["headings"] {
  const out: Compiled["headings"] = [];
  for (const line of source.split("\n")) {
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      out.push({ id: slugifyHeading(text), text, level: m[1] === "##" ? 2 : 3 });
    }
  }
  return out;
}

export async function renderMdx(dir: "learn" | "blog", slug: string): Promise<Compiled | null> {
  const file = path.join(process.cwd(), "src", "content", dir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content: source, data } = matter(raw);
  const headings = extractHeadings(source);
  const { content } = await compileMDX({
    source,
    components: {
      ...mdxComponents,
      h2: ({ children }: { children?: ReactNode }) => {
        const text = typeof children === "string" ? children : String(children);
        return <h2 id={slugifyHeading(text)}>{children}</h2>;
      },
      h3: ({ children }: { children?: ReactNode }) => {
        const text = typeof children === "string" ? children : String(children);
        return <h3 id={slugifyHeading(text)}>{children}</h3>;
      },
    },
    options: { parseFrontmatter: false },
  });
  return { content, frontmatter: data, headings };
}

export function listMdxSlugs(dir: "learn" | "blog"): string[] {
  const folder = path.join(process.cwd(), "src", "content", dir);
  try {
    return fs
      .readdirSync(folder)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

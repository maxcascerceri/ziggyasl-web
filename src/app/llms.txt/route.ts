import { APPS, COMPARISONS } from "@/content/compare/apps";
import { BLOG_POSTS } from "@/lib/blog";
import { allCategories, allSigns } from "@/lib/catalog";
import { LEARN_GUIDES } from "@/lib/learnGuides";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants. */
export function GET() {
  const signCount = allSigns().length;
  const link = (title: string, path: string, note?: string) =>
    `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

  const body = `# Ziggy ASL

> Ziggy is an app for learning American Sign Language (ASL) with short daily video lessons, a learning path, and spaced review. ziggyasl.com also has a free ASL video dictionary of ${signCount} signs and free beginner guides.

Key facts:
- Ziggy teaches American Sign Language (ASL) only.
- Every sign is real video of a real signer, not animation or illustrations.
- Our team includes certified ASL interpreters, who sign our videos, check our signs, and help write and review our guides.
- Lessons are short, built for a few minutes of practice a day, with a learning path, spaced review, flashcards, recognition drills, and streaks.
- The Ziggy app is a subscription with a free trial, on iPhone and Android.
- The ASL dictionary and guides on ziggyasl.com are free, with no sign-up.

## Key pages

${link("Home", "/", "what Ziggy is and how it works")}
${link("ASL dictionary", "/dictionary", `${signCount} signs on real video, free`)}
${link("Learn ASL guides", "/learn", "free beginner guides")}
${link("How to sign your name", "/learn/how-to-sign-your-name", "see any name fingerspelled")}
${link("Best apps to learn sign language", "/best-asl-apps", "our comparison of ASL apps")}
${COMPARISONS.map((c) => link(c.title, `/compare/${c.slug}`)).join("\n")}
${link("About", "/about", "who makes Ziggy and how we check our signs")}

## Guides

${LEARN_GUIDES.map((g) => link(g.title, `/learn/${g.slug}`, g.description)).join("\n")}

## Blog

${BLOG_POSTS.map((p) => link(p.title, `/blog/${p.slug}`, p.description)).join("\n")}

## Dictionary categories

${allCategories()
  .map((c) => link(c.title, `/dictionary/${c.slug}`))
  .join("\n")}

## Apps we compare

${APPS.map((a) => `- ${a.name}: ${a.bestFor}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

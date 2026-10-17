import type { MetadataRoute } from "next";
import { allCategories, allSigns } from "@/lib/catalog";
import { LEARN_GUIDES } from "@/lib/learnGuides";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

const LAST_MODIFIED = new Date("2026-10-17");

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/dictionary"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/learn"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/privacy"), lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/terms"), lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.1 },
  ];

  const categories: MetadataRoute.Sitemap = allCategories().map((c) => ({
    url: absoluteUrl(`/dictionary/${c.slug}`),
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const signs: MetadataRoute.Sitemap = allSigns().map((s) => ({
    url: absoluteUrl(`/sign/${s.slug}`),
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guides: MetadataRoute.Sitemap = LEARN_GUIDES.map((g) => ({
    url: absoluteUrl(`/learn/${g.slug}`),
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...categories, ...guides, ...posts, ...signs];
}

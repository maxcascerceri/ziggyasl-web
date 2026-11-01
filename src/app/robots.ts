import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const DISALLOW = ["/s/", "/team/", "/api/ops/", "/search-index.json"];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/video-sitemap.xml")],
    host: "https://www.ziggyasl.com",
  };
}

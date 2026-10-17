import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/s/", "/team/", "/api/ops/", "/search-index.json"],
    },
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/video-sitemap.xml")],
    host: "https://www.ziggyasl.com",
  };
}

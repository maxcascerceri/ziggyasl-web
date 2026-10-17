import { allSigns } from "@/lib/catalog";
import { signPosterURL, signVideoURL } from "@/lib/firebasePublic";
import { getSignContent } from "@/lib/signContent";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Google video sitemap: one <video:video> per sign page. */
export function GET() {
  const entries = allSigns()
    .map((sign) => {
      const content = getSignContent(sign);
      const seconds = Math.max(1, Math.round(sign.media.durationSec || 2));
      return `  <url>
    <loc>${esc(absoluteUrl(`/sign/${sign.slug}`))}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(signPosterURL(sign.id))}</video:thumbnail_loc>
      <video:title>${esc(`${sign.display} in ASL`)}</video:title>
      <video:description>${esc(content.summary)}</video:description>
      <video:content_loc>${esc(signVideoURL(sign.id))}</video:content_loc>
      <video:duration>${seconds}</video:duration>
      <video:publication_date>2026-07-06T00:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries}
</urlset>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

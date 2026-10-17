import type { NextConfig } from "next";
import catalog from "./src/data/catalog.json" with { type: "json" };

const aasaHeaders = [
  { key: "Content-Type", value: "application/json" },
  { key: "Cache-Control", value: "public, max-age=3600" },
];

type CatalogShape = {
  aliasToCanonical: Record<string, string>;
  signs: { id: string; slug: string }[];
};

/** /sign/{alias} and /sign/{rawId} permanently redirect to the canonical slug. */
function signRedirects() {
  const { aliasToCanonical, signs } = catalog as unknown as CatalogShape;
  const slugById = new Map(signs.map((s) => [s.id, s.slug]));
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const [alias, canonical] of Object.entries(aliasToCanonical)) {
    const slug = slugById.get(canonical);
    if (slug && slug !== alias) {
      out.push({ source: `/sign/${alias}`, destination: `/sign/${slug}`, permanent: true });
    }
  }
  for (const sign of signs) {
    if (sign.id !== sign.slug) {
      out.push({ source: `/sign/${sign.id}`, destination: `/sign/${sign.slug}`, permanent: true });
    }
  }
  return out;
}

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/asl-app-718bf.firebasestorage.app/o/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/team/revenue", destination: "/team", permanent: false },
      { source: "/team/more", destination: "/team", permanent: false },
      ...signRedirects(),
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: aasaHeaders,
      },
      {
        source: "/apple-app-site-association",
        headers: aasaHeaders,
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: aasaHeaders,
      },
    ];
  },
};

export default nextConfig;

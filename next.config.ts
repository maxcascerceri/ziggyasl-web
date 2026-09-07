import type { NextConfig } from "next";

const aasaHeaders = [
  { key: "Content-Type", value: "application/json" },
  { key: "Cache-Control", value: "public, max-age=3600" },
];

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    return [
      { source: "/team/revenue", destination: "/team", permanent: false },
      { source: "/team/more", destination: "/team", permanent: false },
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

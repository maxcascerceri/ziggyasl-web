#!/usr/bin/env node
// Pings IndexNow (Bing, Yandex, and others) with the page URLs affected by a deploy.
// Usage: node scripts/indexnow.mjs <base-sha> <head-sha> [--dry-run]

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const HOST = "www.ziggyasl.com";
const SITE = `https://${HOST}`;
const KEY = "d4c06aaf0cbd2e96d2e9f3cafd9a00b1";

const [base, head = "HEAD"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
if (!base) {
  console.error("Usage: node scripts/indexnow.mjs <base-sha> <head-sha> [--dry-run]");
  process.exit(1);
}

const files = execFileSync("git", ["diff", "--name-only", base, head], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8"));
const signSlug = new Map(catalog.signs.map((s) => [s.id, s.slug]));
const compareSlugs = [...readFileSync("src/content/compare/apps.ts", "utf8").matchAll(/slug: "([^"]+)"/g)].map(
  (m) => m[1],
);

const paths = new Set();
for (const file of files) {
  let m;
  if ((m = file.match(/^src\/content\/(blog|learn)\/([^/]+)\.mdx$/))) {
    paths.add(`/${m[1]}/${m[2]}`);
  } else if ((m = file.match(/^src\/content\/signs\/([^/]+)\.json$/))) {
    const slug = signSlug.get(m[1]);
    if (slug) paths.add(`/sign/${slug}`);
  } else if (file.startsWith("src/content/compare/")) {
    paths.add("/best-asl-apps");
    for (const slug of compareSlugs) paths.add(`/compare/${slug}`);
  } else if (file === "src/lib/blog.ts") {
    paths.add("/blog");
  } else if (file === "src/lib/learnGuides.ts") {
    paths.add("/learn");
  } else if (file === "src/lib/copy.ts" || file === "src/components/HomeFAQ.tsx") {
    paths.add("/");
  } else if ((m = file.match(/^src\/app\/(.*?)\/?page\.tsx$/)) && !m[1].includes("[")) {
    if (!/^(team|s|api)(\/|$)/.test(m[1])) paths.add(`/${m[1]}`);
  }
}

const urlList = [...paths].map((p) => `${SITE}${p === "/" ? "" : p}`);
if (urlList.length === 0) {
  console.log("No public pages changed; nothing to submit.");
  process.exit(0);
}

console.log(`Submitting ${urlList.length} URL(s):\n${urlList.join("\n")}`);
if (dryRun) process.exit(0);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urlList.slice(0, 10000) }),
});
console.log(`IndexNow responded ${res.status} ${res.statusText}`);
if (!res.ok && res.status !== 202) process.exit(1);

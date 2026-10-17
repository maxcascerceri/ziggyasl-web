// Typed access to the sign dictionary catalog exported from the iOS app repo
// by ASL/scripts/export_web_catalog.py. Everything here runs at build time.

import catalogJson from "@/data/catalog.json";

export type Tint = "blue" | "mint" | "yellow" | "peach";

export type SignTip = {
  id: string;
  title: string;
  text: string;
  themes: string[];
};

export type SignSentence = {
  before: string;
  after: string;
  unitId: string;
  unitTitle: string;
};

export type SignMedia = {
  video: string;
  poster: string;
  thumb: string;
  durationSec: number;
  isoDuration: string;
  width: number;
  height: number;
};

export type Sign = {
  id: string;
  slug: string;
  display: string;
  type: "word" | "phrase";
  aliases: string[];
  aliasIds: string[];
  categoryIds: string[];
  phraseComponents: string[];
  unitId: string | null;
  unitTitle: string;
  signer: string | null;
  media: SignMedia;
  tips: SignTip[];
  sentences: SignSentence[];
  relatedIds: string[];
};

/** The slice of a Sign a grid card needs. Pass this (not a full Sign) to client components. */
export type SignCardData = Pick<Sign, "id" | "slug" | "display" | "type" | "aliases">;

export function toSignCardData(sign: Sign): SignCardData {
  return { id: sign.id, slug: sign.slug, display: sign.display, type: sign.type, aliases: sign.aliases };
}

export type Category = {
  id: string;
  slug: string;
  title: string;
  symbol: string;
  mascot: string | null;
  tint: Tint;
  wordIds: string[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  badge: string;
  phaseKey: string;
  phaseTitle: string;
  sortOrder: number;
  wordIds: string[];
};

type Catalog = {
  generatedAt: string;
  storageBucket: string;
  counts: { signs: number; categories: number; units: number };
  aliasToCanonical: Record<string, string>;
  categories: Category[];
  signs: Sign[];
  units: Unit[];
};

const catalog = catalogJson as unknown as Catalog;

const signById = new Map<string, Sign>(catalog.signs.map((s) => [s.id, s]));
const signBySlug = new Map<string, Sign>(catalog.signs.map((s) => [s.slug, s]));
const categoryById = new Map<string, Category>(
  catalog.categories.map((c) => [c.id, c]),
);
const unitById = new Map<string, Unit>(catalog.units.map((u) => [u.id, u]));

export const catalogMeta = {
  generatedAt: catalog.generatedAt,
  counts: catalog.counts,
};

export function allSigns(): Sign[] {
  return catalog.signs;
}

export function allCategories(): Category[] {
  return catalog.categories;
}

export function allUnits(): Unit[] {
  return catalog.units;
}

export function getSign(id: string): Sign | undefined {
  return signById.get(id) ?? signById.get(catalog.aliasToCanonical[id] ?? "");
}

export function getSignBySlug(slug: string): Sign | undefined {
  return signBySlug.get(slug);
}

export function getSigns(ids: string[]): Sign[] {
  return ids.map((id) => getSign(id)).filter((s): s is Sign => Boolean(s));
}

export function getCategory(id: string): Category | undefined {
  return categoryById.get(id);
}

export function getUnit(id: string): Unit | undefined {
  return unitById.get(id);
}

export function primaryCategory(sign: Sign): Category | undefined {
  for (const id of sign.categoryIds) {
    const c = categoryById.get(id);
    if (c) return c;
  }
  return undefined;
}

export function categorySigns(category: Category): Sign[] {
  return getSigns(category.wordIds);
}

/** Previous and next sign inside the sign's primary category. */
export function siblings(sign: Sign): { prev?: Sign; next?: Sign } {
  const category = primaryCategory(sign);
  if (!category) return {};
  const idx = category.wordIds.indexOf(sign.id);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? getSign(category.wordIds[idx - 1]) : undefined,
    next:
      idx < category.wordIds.length - 1
        ? getSign(category.wordIds[idx + 1])
        : undefined,
  };
}

/** Alias ids (me, she, him…) that should 301 to the canonical sign slug. */
export function aliasRedirects(): { from: string; to: string }[] {
  const out: { from: string; to: string }[] = [];
  for (const [alias, canonical] of Object.entries(catalog.aliasToCanonical)) {
    const sign = signById.get(canonical);
    if (!sign) continue;
    out.push({ from: `/sign/${alias}`, to: `/sign/${sign.slug}` });
  }
  // Bare ids that differ from their slug (e.g. /sign/thankyou -> /sign/thank-you)
  for (const sign of catalog.signs) {
    if (sign.id !== sign.slug) {
      out.push({ from: `/sign/${sign.id}`, to: `/sign/${sign.slug}` });
    }
  }
  return out;
}

/** A–Z groups for the dictionary index. Digits are grouped under "#". */
export function alphabetGroups(): { letter: string; signs: Sign[] }[] {
  const groups = new Map<string, Sign[]>();
  const sorted = [...catalog.signs].sort((a, b) =>
    a.display.localeCompare(b.display, "en", { sensitivity: "base" }),
  );
  for (const sign of sorted) {
    const first = sign.display[0]?.toUpperCase() ?? "#";
    const letter = /[A-Z]/.test(first) ? first : "#";
    const bucket = groups.get(letter) ?? [];
    bucket.push(sign);
    groups.set(letter, bucket);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)))
    .map(([letter, signs]) => ({ letter, signs }));
}

/** Deterministic daily pick so the hub, home, and OG stay in sync. */
export function signOfTheDay(date = new Date()): Sign {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  const pool = catalog.signs.filter((s) => s.categoryIds.length > 0);
  return pool[dayIndex % pool.length];
}

/** Example sentence rendered as plain text with the sign filled in. */
/**
 * Join a sentence fragment pair around the sign's display name. The catalog's
 * before/after fragments are inconsistent about spaces ("Today" + "is my birthday."),
 * so we normalize: a space on each side unless the fragment already has one or the
 * after-fragment starts with punctuation, and a capital first letter.
 */
export function sentenceText(sign: Sign, s: SignSentence): string {
  const before = s.before.trim();
  const after = s.after.trim();
  const joinAfter = after && !/^[.,!?;:'’”)]/.test(after) ? " " : "";
  // Mid-sentence, write the sign as a normal English word unless it's a proper noun or "I".
  const display =
    before && !isProperNoun(sign)
      ? sign.display
          .split(" ")
          .map((w) => (/^[A-Z]{2,}$/.test(w) || w === "I" ? w : w.toLowerCase()))
          .join(" ")
      : sign.display;
  const text = `${before}${before ? " " : ""}${display}${joinAfter}${after}`.trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const PROPER_NOUN_CATEGORIES = new Set(["weekdays", "holidays", "countries", "brands-stores", "alphabet"]);

function isProperNoun(sign: Sign): boolean {
  if (sign.display === "I" || /^I['’]/.test(sign.display)) return true;
  if (/^[A-Z]{2,}$/.test(sign.display)) return true; // acronyms like ASL
  return sign.categoryIds.some((c) => PROPER_NOUN_CATEGORIES.has(c));
}

/** Compact index for the client-side search palette. */
export type SearchEntry = {
  id: string;
  slug: string;
  display: string;
  aliases: string[];
  category: string;
  type: "word" | "phrase";
};

export function searchIndex(): SearchEntry[] {
  return catalog.signs.map((s) => ({
    id: s.id,
    slug: s.slug,
    display: s.display,
    aliases: s.aliases,
    category: primaryCategory(s)?.title ?? "",
    type: s.type,
  }));
}

/** Categories most beginners search for first. Order matters. */
export const START_HERE_CATEGORY_IDS = [
  "greetings",
  "responses",
  "pronouns",
  "questions",
  "alphabet",
  "numbers",
  "mood-basics",
  "family",
];

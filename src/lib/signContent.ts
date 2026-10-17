// Editorial layer for sign pages. Hand-written files live in
// src/content/signs/{id}.json and are merged over a data-driven baseline so
// every one of the 700+ pages has steps, a mistake, an example, and FAQ even
// before a teacher has written it up in full.

import fs from "node:fs";
import path from "node:path";
import {
  getSign,
  getSigns,
  primaryCategory,
  sentenceText,
  type Sign,
} from "./catalog";
import type { FAQItem } from "@/components/FAQ";

export type SignContent = {
  /** One-line meaning / usage summary shown under the H1. */
  summary: string;
  /** Production facts used for chips. */
  hands?: "one" | "two";
  handshape?: string;
  location?: string;
  movement?: string;
  /** Ordered production steps. */
  steps: string[];
  /** Teacher's note: a memory hook or cultural note. */
  note?: string;
  mistakes: string[];
  /** Extra example sentences in English gloss order (optional). */
  examples?: string[];
  faq: FAQItem[];
  /** True when a teacher wrote this file (vs. generated baseline). */
  authored: boolean;
  reviewed?: boolean;
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "signs");

type Authored = Partial<Omit<SignContent, "authored">>;

const cache = new Map<string, Authored | null>();

function readAuthored(id: string): Authored | null {
  if (cache.has(id)) return cache.get(id) ?? null;
  const file = path.join(CONTENT_DIR, `${id}.json`);
  let parsed: Authored | null = null;
  try {
    if (fs.existsSync(file)) {
      parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Authored;
    }
  } catch {
    parsed = null;
  }
  cache.set(id, parsed);
  return parsed;
}

export function authoredSignIds(): string[] {
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function lower(s: string): string {
  return s.replace(/\?$/, "").toLowerCase();
}

/** Data-driven baseline. Never invents handshapes or movements. */
function baseline(sign: Sign): SignContent {
  const category = primaryCategory(sign);
  const catTitle = category?.title ?? "Everyday signs";
  const name = sign.display;
  const lname = lower(name);
  const isPhrase = sign.type === "phrase";
  const components = getSigns(sign.phraseComponents);
  const aliasText =
    sign.aliases.length > 0
      ? ` In English it covers ${[name, ...sign.aliases].join(", ")}; in ASL those share one sign.`
      : "";

  const summary = isPhrase
    ? `${name} is ${article(catTitle)} ${catTitle.toLowerCase()} phrase in American Sign Language.${aliasText} Watch the clip, then sign it along with the video.`
    : `${name} is the ASL sign for ${lname}, filed under ${catTitle}.${aliasText} Watch the clip, then sign it along with the video.`;

  const steps: string[] = [];
  if (isPhrase && components.length > 0) {
    steps.push(
      `This phrase is signed as a sequence: ${components.map((c) => c.display.toUpperCase()).join(" → ")}. ASL drops English filler words, so there is no sign for "is", "a", or "the".`,
    );
    steps.push(
      "Keep the signs flowing into each other without pausing between them. One smooth phrase reads more naturally than three separate signs.",
    );
    steps.push(
      "Match your face to the meaning. Questions get raised or lowered eyebrows; feelings get the feeling. The face is part of the grammar.",
    );
  } else {
    steps.push(
      `Watch the clip once at full speed, then once at half speed. Notice the handshape, where the sign sits, and the direction the hand moves.`,
    );
    steps.push(
      `Sign ${lname} along with the video. Keep your hand where the signer keeps it; moving a sign up, down, or off to the side can change its meaning.`,
    );
    steps.push(
      "Add the face. Even a plain vocabulary sign reads better with natural eye contact and an expression that matches the context.",
    );
  }

  const mistakes: string[] = [
    "Mouthing the full English sentence while you sign. Mouth the ASL gloss or keep your lips relaxed; ASL is its own language, not English on the hands.",
    "Signing too low or too far from the body. Keep your signing space between your chest and your chin where it is easy to see.",
  ];
  if (sign.aliases.length > 0) {
    mistakes.unshift(
      `Looking for a separate sign for ${sign.aliases.join(" or ")}. ASL uses one sign here; the English word changes, the sign does not.`,
    );
  }
  if (isPhrase) {
    mistakes.unshift(
      "Pausing between each sign. Treat the phrase as one unit with one rhythm.",
    );
  }

  const examples = sign.sentences.map((s) => sentenceText(sign, s));

  const faq: FAQItem[] = [];
  if (isPhrase) {
    faq.push({
      q: `How many signs are in "${name}"?`,
      a:
        components.length > 0
          ? `${components.length === 1 ? "One sign" : `${components.length} signs`}: ${components.map((c) => c.display).join(", ")}. ASL leaves out English words like "is", "a", and "the", so the phrase is shorter than the English.`
          : `"${name}" is signed as a single unit in ASL rather than word-for-word from English.`,
    });
  } else {
    faq.push({
      q: `Is there one sign for "${lname}" in ASL?`,
      a: sign.aliases.length
        ? `Yes. ${name} and ${sign.aliases.join(" and ")} are produced the same way; context tells you which English word fits.`
        : `Yes. This clip shows the common ASL sign for ${lname}. Like spoken languages, ASL has regional variation, so you may see small differences from signer to signer.`,
    });
  }
  faq.push({
    q: `What other signs go with "${name}"?`,
    a: `${name} sits in our ${catTitle} category with ${Math.max(0, (category?.wordIds.length ?? 1) - 1)} related signs. Learning signs in groups like that is the fastest way to start building sentences.`,
  });
  faq.push({
    q: `How do I practice "${name}"?`,
    a: "Watch the clip, sign it along with the video three times, then sign it once with your eyes closed. In the Ziggy app the same sign shows up in quick recognition drills and spaced review so it sticks.",
  });

  return {
    summary,
    hands: undefined,
    steps,
    mistakes,
    examples,
    faq,
    authored: false,
  };
}

export function getSignContent(sign: Sign): SignContent {
  const base = baseline(sign);
  const authored = readAuthored(sign.id);
  if (!authored) return base;
  return {
    ...base,
    ...authored,
    steps: authored.steps?.length ? authored.steps : base.steps,
    mistakes: authored.mistakes?.length ? authored.mistakes : base.mistakes,
    examples: [
      ...(authored.examples ?? []),
      ...(base.examples ?? []),
    ].filter((v, i, arr) => arr.indexOf(v) === i),
    faq: authored.faq?.length ? [...authored.faq, ...base.faq.slice(-1)] : base.faq,
    authored: true,
  };
}

export function contentForId(id: string): SignContent | undefined {
  const sign = getSign(id);
  return sign ? getSignContent(sign) : undefined;
}

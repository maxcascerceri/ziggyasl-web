// Blog registry. Bodies live in src/content/blog/{slug}.mdx. Metadata lives
// here so sign pages, the hub, and the sitemap can link without parsing MDX.

import type { Sign } from "./catalog";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  publishedAt: string;
  updatedAt: string;
  minutes: number;
  tint: "blue" | "mint" | "yellow" | "peach";
  /** Category ids this post is most relevant to (drives sign-page links). */
  categoryIds: string[];
  /** Sign ids the post links to heavily. */
  signIds: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-long-does-it-take-to-learn-asl",
    title: "How Long Does It Take to Learn ASL? An Honest Timeline",
    description:
      "What you can realistically sign after one week, one month, six months, and two years of ASL, and the daily habits that move you between those stages faster.",
    keyword: "how long does it take to learn ASL",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 8,
    tint: "blue",
    categoryIds: ["greetings", "responses", "deaf-world"],
    signIds: ["hello", "thankyou", "imlearningasl", "isignalittle", "signslow", "practice", "fluent"],
  },
  {
    slug: "first-50-asl-signs",
    title: "The First 50 ASL Signs to Learn (and Why These 50)",
    description:
      "A teacher-picked starter vocabulary: greetings, replies, pronouns, question words, and feelings that let you hold a real first conversation. Every sign on video.",
    keyword: "first ASL signs to learn",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 10,
    tint: "mint",
    categoryIds: ["greetings", "responses", "pronouns", "questions", "mood-basics"],
    signIds: [
      "hello", "bye", "please", "thankyou", "sorry", "yes", "no", "i", "you",
      "what", "where", "who", "happy", "sad", "tired", "help", "eat", "drink",
      "name", "mynameis", "nicetomeetyou", "howareyou", "imfine",
    ],
  },
  {
    slug: "asl-grammar-vs-english",
    title: "ASL Grammar Is Not English: 7 Rules That Change Everything",
    description:
      "Topic-comment order, time at the front, no 'is' or 'the', and eyebrows that ask the question. The grammar rules that make ASL its own language, with signed examples.",
    keyword: "ASL grammar",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 9,
    tint: "yellow",
    categoryIds: ["questions", "sentence-helpers", "time-of-day"],
    signIds: ["what", "where", "yesterday", "tomorrow", "finish", "not", "i", "you", "you"],
  },
  {
    slug: "asl-vs-bsl",
    title: "ASL vs BSL: Why American and British Sign Language Are Different Languages",
    description:
      "They share almost no signs, use different alphabets, and come from different histories. What that means if you are choosing which to learn.",
    keyword: "ASL vs BSL",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 6,
    tint: "peach",
    categoryIds: ["deaf-world", "alphabet", "countries"],
    signIds: ["asl", "signlanguage", "america", "a", "b", "deaf"],
  },
  {
    slug: "learning-sign-language-as-an-adult",
    title: "Learning Sign Language as an Adult: What Actually Works",
    description:
      "Adults learn ASL differently than kids. Here is how to use that to your advantage: video-first practice, short daily sessions, receptive drills, and finding real signers.",
    keyword: "learn sign language as an adult",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 8,
    tint: "blue",
    categoryIds: ["greetings", "deaf-world", "school"],
    signIds: ["learnasl", "practice", "imlearningasl", "slow", "again", "understand"],
  },
  {
    slug: "signing-with-your-baby",
    title: "Signing With Your Baby: First Signs, Timing, and What the Research Says",
    description:
      "Milk, more, all done, eat, sleep. When to start, how to be consistent, and why real ASL signs beat made-up gestures.",
    keyword: "baby sign language",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 7,
    tint: "mint",
    categoryIds: ["family", "mealtime", "body-actions"],
    signIds: ["milk", "more", "eat", "drink", "sleep", "baby", "mother", "father", "please", "thankyou", "water"],
  },
  {
    slug: "deaf-culture-etiquette-for-beginners",
    title: "Deaf Culture Etiquette: 12 Things Hearing Beginners Should Know",
    description:
      "How to get someone's attention, why eye contact is not rude, what to do when you do not understand, and how to be a welcome guest in Deaf spaces.",
    keyword: "Deaf culture etiquette",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 8,
    tint: "yellow",
    categoryIds: ["deaf-world", "greetings", "responses"],
    signIds: ["deaf", "hearing", "interpreter", "idontunderstand", "signagain", "signslow", "namesign", "excuseme"],
  },
  {
    slug: "fingerspelling-tips",
    title: "Fingerspelling Tips: How to Spell Faster and Read Fingerspelling Better",
    description:
      "Fingerspelling is where most beginners stall. The fixes: a steady hand position, mouthing the word not the letters, reading shapes not letters, and the drills that build speed.",
    keyword: "fingerspelling tips",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 7,
    tint: "peach",
    categoryIds: ["alphabet", "fingerspelling"],
    signIds: ["fingerspell", "alphabet", "name", "letter", "a", "e", "s", "m", "n", "t"],
  },
  {
    slug: "facial-expressions-in-asl",
    title: "Facial Expressions in ASL Are Grammar, Not Decoration",
    description:
      "Eyebrows ask questions, a head shake negates, mouth shapes change size and intensity. The non-manual markers every beginner needs and how to practice them.",
    keyword: "facial expressions in ASL",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 8,
    tint: "blue",
    categoryIds: ["questions", "mood-basics", "descriptions"],
    signIds: ["what", "why", "yes", "no", "happy", "sad", "big", "small", "not", "face"],
  },
  {
    slug: "common-beginner-mistakes-asl",
    title: "10 Common ASL Beginner Mistakes (and the Fix for Each)",
    description:
      "Signing English word order, a blank face, signing too low, dropping eye contact, fingerspelling everything. Each mistake, why it happens, and the one habit that fixes it.",
    keyword: "ASL beginner mistakes",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 8,
    tint: "mint",
    categoryIds: ["greetings", "questions", "responses"],
    signIds: ["hello", "thankyou", "what", "yes", "no", "signslow", "again", "understand"],
  },
  {
    slug: "practice-asl-without-a-partner",
    title: "How to Practice ASL Without a Signing Partner",
    description:
      "Receptive practice, mirror work, self-recording, narrating your day, and the apps and communities that give you real signing when nobody around you signs.",
    keyword: "practice ASL alone",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 7,
    tint: "yellow",
    categoryIds: ["body-actions", "time-of-day", "home"],
    signIds: ["practice", "eat", "drink", "sleep", "morning", "night", "today", "home", "work", "coffee"],
  },
  {
    slug: "is-sign-language-universal",
    title: "Is Sign Language Universal? No, and Here Is Why That Is a Good Thing",
    description:
      "There are over 300 sign languages in the world. Where ASL comes from, how it relates to French Sign Language, and what International Sign actually is.",
    keyword: "is sign language universal",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    minutes: 6,
    tint: "peach",
    categoryIds: ["deaf-world", "countries"],
    signIds: ["signlanguage", "asl", "america", "canada", "mexico", "france", "deaf", "language"],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function relatedPostsForSign(sign: Sign): BlogPost[] {
  const scored = BLOG_POSTS.map((p) => {
    let score = 0;
    if (p.signIds.includes(sign.id)) score += 10;
    for (const c of sign.categoryIds) if (p.categoryIds.includes(c)) score += 3;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const out = scored.map((x) => x.p);
  return out.length ? out : [BLOG_POSTS[1]];
}

export function postsForCategory(categoryId: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.categoryIds.includes(categoryId)).slice(0, 3);
}

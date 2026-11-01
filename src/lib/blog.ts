// Blog registry. Bodies live in src/content/blog/{slug}.mdx. Metadata lives
// here so sign pages, the hub, and the sitemap can link without parsing MDX.

import type { FAQItem } from "@/components/FAQ";
import type { Sign } from "./catalog";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  publishedAt: string;
  updatedAt: string;
  /** One-paragraph answer shown above the article and quoted by search and AI answers. */
  quickAnswer?: string;
  /** Visible FAQ after the article, also emitted as FAQPage structured data. */
  faq?: FAQItem[];
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
    updatedAt: "2026-11-01",
    minutes: 8,
    tint: "blue",
    categoryIds: ["greetings", "responses", "deaf-world"],
    signIds: ["hello", "thankyou", "imlearningasl", "isignalittle", "signslow", "practice", "fluent"],
    quickAnswer:
      "A basic introduction takes about a week. A slow, friendly conversation takes a few months of daily practice. Fluency takes years, like any language. Short daily sessions move you through each stage fastest.",
    faq: [
      {
        q: "Can you learn ASL in 3 months?",
        a: "You can reach simple conversations in about three months of daily practice: around 300 signs, basic grammar, and talking about yourself, your family, and your day with a patient partner.",
      },
      {
        q: "How long does it take to become fluent in ASL?",
        a: "Usually years, as with any language. Most hearing adults who sign fluently learned through immersion: a program with Deaf teachers, Deaf family or partners, or years in the community.",
      },
      {
        q: "How many minutes a day should I practice?",
        a: "Ten to fifteen minutes a day is enough for steady progress. Daily practice beats long weekly sessions because signs fade fast in the first weeks.",
      },
    ],
  },
  {
    slug: "first-50-asl-signs",
    title: "The First 50 ASL Signs to Learn (and Why These 50)",
    description:
      "A starter vocabulary picked for real first conversations: greetings, replies, pronouns, question words, and feelings that let you hold a real first conversation. Every sign on video.",
    keyword: "first ASL signs to learn",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 10,
    tint: "mint",
    categoryIds: ["greetings", "responses", "pronouns", "questions", "mood-basics"],
    signIds: [
      "hello", "bye", "please", "thankyou", "sorry", "yes", "no", "i", "you",
      "what", "where", "who", "happy", "sad", "tired", "help", "eat", "drink",
      "name", "mynameis", "nicetomeetyou", "howareyou", "imfine",
    ],
    quickAnswer:
      "Start with the signs from your first conversation: greetings, please, thank you, sorry, yes, no, pronouns, question words, and a few feelings. Learn them in groups that go together.",
    faq: [
      {
        q: "What are the first signs to learn in ASL?",
        a: "Hello, nice to meet you, please, thank you, sorry, yes, no, and the pronouns I and you. Add question words like what and where next.",
      },
      {
        q: "Should I learn the alphabet first?",
        a: "Learn it alongside your first signs. The alphabet lets you spell names and words you don't know yet; signs are what you use in conversation.",
      },
      {
        q: "How long does it take to learn 50 signs?",
        a: "About a week at ten signs a day, if you practice in groups and review each day.",
      },
    ],
  },
  {
    slug: "asl-grammar-vs-english",
    title: "ASL Grammar Is Not English: 7 Rules That Change Everything",
    description:
      "Topic-comment order, time at the front, no 'is' or 'the', and eyebrows that ask the question. The grammar rules that make ASL its own language, with signed examples.",
    keyword: "ASL grammar",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 9,
    tint: "yellow",
    categoryIds: ["questions", "sentence-helpers", "time-of-day"],
    signIds: ["what", "where", "yesterday", "tomorrow", "finish", "not", "i", "you", "you"],
    quickAnswer:
      "ASL has its own grammar. It often puts the topic first and time words at the start, drops words like \"is\" and \"the,\" and uses the face as grammar: eyebrows down for who/what/where questions, up for yes/no questions.",
    faq: [
      {
        q: "Is ASL just English in signs?",
        a: "No. ASL is its own language with its own word order and grammar. Signing English word for word is a different system, not ASL.",
      },
      {
        q: "What is the word order in ASL?",
        a: "Time usually comes first, then the topic, then the comment. Question words often go at the end.",
      },
      {
        q: "Does ASL use \"is\" and \"the\"?",
        a: "No. ASL has no signs for \"is,\" \"a,\" or \"the.\" The meaning comes from context, space, and your face.",
      },
    ],
  },
  {
    slug: "asl-vs-bsl",
    title: "ASL vs BSL: Why American and British Sign Language Are Different Languages",
    description:
      "They share almost no signs, use different alphabets, and come from different histories. What that means if you are choosing which to learn.",
    keyword: "ASL vs BSL",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 6,
    tint: "peach",
    categoryIds: ["deaf-world", "alphabet", "countries"],
    signIds: ["asl", "signlanguage", "america", "a", "b", "deaf"],
    quickAnswer:
      "They're separate languages with different signs, grammar, and alphabets. ASL fingerspells with one hand and BSL with two, so a fluent ASL signer can't follow BSL.",
    faq: [
      {
        q: "Can ASL and BSL signers understand each other?",
        a: "Not without learning the other language. The vocabulary, grammar, and alphabets are different.",
      },
      {
        q: "Should I learn ASL or BSL?",
        a: "Learn the one used by the Deaf community near you: ASL in the United States and most of Canada, BSL in the United Kingdom.",
      },
      {
        q: "Why are ASL and BSL so different?",
        a: "They have different histories. ASL descends mostly from French Sign Language, while BSL developed separately in Britain.",
      },
    ],
  },
  {
    slug: "learning-sign-language-as-an-adult",
    title: "Learning Sign Language as an Adult: What Actually Works",
    description:
      "Adults learn ASL differently than kids. Here is how to use that to your advantage: video-first practice, short daily sessions, receptive drills, and finding real signers.",
    keyword: "learn sign language as an adult",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 8,
    tint: "blue",
    categoryIds: ["greetings", "deaf-world", "school"],
    signIds: ["learnasl", "practice", "imlearningasl", "slow", "again", "understand"],
    quickAnswer:
      "Adults learn ASL well. What works: short daily video practice, learning in phrases and patterns, weekly feedback from a class or tutor, and time with Deaf signers.",
    faq: [
      {
        q: "Is it too late to learn sign language as an adult?",
        a: "No. Adults learn differently, not worse. You can use patterns, grammar, and deliberate practice in ways children can't.",
      },
      {
        q: "What is the best way for adults to learn ASL?",
        a: "Learn from video, practice a little every day, start with recognizing signs before producing them, and find real signers to practice with.",
      },
      {
        q: "Why do adult learners plateau?",
        a: "Usually around the point where you know signs but your facial grammar is flat. Mirror practice and feedback from real signers get you through it.",
      },
    ],
  },
  {
    slug: "signing-with-your-baby",
    title: "Signing With Your Baby: First Signs, Timing, and What the Research Says",
    description:
      "Milk, more, all done, eat, sleep. When to start, how to be consistent, and why real ASL signs beat made-up gestures.",
    keyword: "baby sign language",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 7,
    tint: "mint",
    categoryIds: ["family", "mealtime", "body-actions"],
    signIds: ["milk", "more", "eat", "drink", "sleep", "baby", "mother", "father", "please", "thankyou", "water"],
    quickAnswer:
      "Use real ASL signs, not made-up \"baby signs.\" Start with everyday words like milk, more, eat, and sleep, and sign them every time you say them. If your child is Deaf or hard of hearing, prioritize full ASL exposure and talk to your early intervention team.",
    faq: [
      {
        q: "When should I start signing with my baby?",
        a: "Whenever you like. Many parents start around six months, and most babies produce a first sign somewhere between eight and twelve months.",
      },
      {
        q: "Does baby sign language delay speech?",
        a: "No. Research consistently finds that signing with hearing babies does not delay spoken language.",
      },
      {
        q: "What are the first baby signs to learn?",
        a: "Milk, more, and eat. Add drink, sleep, and water once those land.",
      },
    ],
  },
  {
    slug: "deaf-culture-etiquette-for-beginners",
    title: "Deaf Culture Etiquette: 12 Things Hearing Beginners Should Know",
    description:
      "How to get someone's attention, why eye contact is not rude, what to do when you do not understand, and how to be a welcome guest in Deaf spaces.",
    keyword: "Deaf culture etiquette",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 8,
    tint: "yellow",
    categoryIds: ["deaf-world", "greetings", "responses"],
    signIds: ["deaf", "hearing", "interpreter", "idontunderstand", "signagain", "signslow", "namesign", "excuseme"],
    quickAnswer:
      "Get attention with a wave or a light shoulder tap, keep eye contact, talk to the Deaf person rather than the interpreter, and don't invent your own name sign.",
    faq: [
      {
        q: "How do you get a Deaf person's attention?",
        a: "Wave in their line of sight or lightly tap their shoulder or upper arm. For a room, flick the lights. Don't shout or wave in someone's face.",
      },
      {
        q: "Is it rude to say \"deaf\"?",
        a: "No. Say Deaf. Most Deaf people dislike \"hearing impaired,\" and \"hard of hearing\" is for people who identify that way.",
      },
      {
        q: "Can I give myself a name sign?",
        a: "No. Name signs are given by Deaf people. Until you have one, fingerspell your name.",
      },
    ],
  },
  {
    slug: "fingerspelling-tips",
    title: "Fingerspelling Tips: How to Spell Faster and Read Fingerspelling Better",
    description:
      "Fingerspelling is where most beginners stall. The fixes: a steady hand position, mouthing the word not the letters, reading shapes not letters, and the drills that build speed.",
    keyword: "fingerspelling tips",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 7,
    tint: "peach",
    categoryIds: ["alphabet", "fingerspelling"],
    signIds: ["fingerspell", "alphabet", "name", "letter", "a", "e", "s", "m", "n", "t"],
    quickAnswer:
      "Keep your hand still at shoulder height, aim for steady rhythm over speed, and don't bounce on each letter. To read fingerspelling, watch the shape of the whole word, not single letters.",
    faq: [
      {
        q: "How do I get faster at fingerspelling?",
        a: "Focus on rhythm first and speed comes with it. Keep the wrist still, mouth the whole word, and practice words you spell often, like your name.",
      },
      {
        q: "How do I read fingerspelling?",
        a: "Watch the overall shape of the word instead of catching each letter, and use context to predict what's being spelled.",
      },
      {
        q: "Should I mouth the letters when I fingerspell?",
        a: "No. Mouth the whole word once, the way fluent signers do. Mouthing each letter makes you harder to read.",
      },
    ],
  },
  {
    slug: "facial-expressions-in-asl",
    title: "Facial Expressions in ASL Are Grammar, Not Decoration",
    description:
      "Eyebrows ask questions, a head shake negates, mouth shapes change size and intensity. The non-manual markers every beginner needs and how to practice them.",
    keyword: "facial expressions in ASL",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 8,
    tint: "blue",
    categoryIds: ["questions", "mood-basics", "descriptions"],
    signIds: ["what", "why", "yes", "no", "happy", "sad", "big", "small", "not", "face"],
    quickAnswer:
      "Facial expressions are grammar in ASL. Raised eyebrows mark yes/no questions, lowered eyebrows mark who/what/where questions, a head shake negates, and mouth shapes show size and intensity.",
    faq: [
      {
        q: "Why are facial expressions important in ASL?",
        a: "Because they carry grammar. The same signs can be a statement or a question depending on your eyebrows.",
      },
      {
        q: "Do I have to use facial expressions when I sign?",
        a: "Yes. Without them your questions don't look like questions and your signing is hard to follow.",
      },
      {
        q: "How do I practice ASL facial expressions?",
        a: "Practice in a mirror, exaggerate on purpose for a week, and record yourself. Most beginners move their face less than they think.",
      },
    ],
  },
  {
    slug: "common-beginner-mistakes-asl",
    title: "10 Common ASL Beginner Mistakes (and the Fix for Each)",
    description:
      "Signing English word order, a blank face, signing too low, dropping eye contact, fingerspelling everything. Each mistake, why it happens, and the one habit that fixes it.",
    keyword: "ASL beginner mistakes",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 8,
    tint: "mint",
    categoryIds: ["greetings", "questions", "responses"],
    signIds: ["hello", "thankyou", "what", "yes", "no", "signslow", "again", "understand"],
    quickAnswer:
      "The most common ones: signing in English word order, keeping a blank face, signing too low or too wide, fingerspelling everything, bouncing while you fingerspell, nodding along when you're lost, and quitting at the plateau.",
    faq: [
      {
        q: "What is the biggest mistake ASL beginners make?",
        a: "Signing in English word order. ASL has its own grammar, so translating word for word produces signing that's hard to follow.",
      },
      {
        q: "Is it rude to pretend I understood?",
        a: "Nodding through confusion is what actually annoys people. Asking someone to sign again or sign slower is polite and expected.",
      },
      {
        q: "How do I get past an ASL plateau?",
        a: "Work on facial grammar, watch real signers, and get feedback from a class, tutor, or community event.",
      },
    ],
  },
  {
    slug: "practice-asl-without-a-partner",
    title: "How to Practice ASL Without a Signing Partner",
    description:
      "Receptive practice, mirror work, self-recording, narrating your day, and the apps and communities that give you real signing when nobody around you signs.",
    keyword: "practice ASL alone",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 7,
    tint: "yellow",
    categoryIds: ["body-actions", "time-of-day", "home"],
    signIds: ["practice", "eat", "drink", "sleep", "morning", "night", "today", "home", "work", "coffee"],
    quickAnswer:
      "Sign along with video, record yourself and compare, narrate your day in sign, do receptive drills, practice your facial expressions in a mirror, and build full sentences instead of single words.",
    faq: [
      {
        q: "Can I practice ASL alone?",
        a: "Yes. Narrating your day, receptive drills, mirror work, and recording yourself all build real skill without a partner.",
      },
      {
        q: "How do I practice understanding ASL?",
        a: "Watch real signers often, such as Deaf creators and interpreted events, and do drills where you identify signs from video.",
      },
      {
        q: "Where can I find people to sign with?",
        a: "ASL classes, local meetups, Deaf community events, and online meetups. Go as a respectful guest.",
      },
    ],
  },
  {
    slug: "is-sign-language-universal",
    title: "Is Sign Language Universal? No, and Here Is Why That Is a Good Thing",
    description:
      "There are over 300 sign languages in the world. Where ASL comes from, how it relates to French Sign Language, and what International Sign actually is.",
    keyword: "is sign language universal",
    publishedAt: "2026-10-17",
    updatedAt: "2026-11-01",
    minutes: 6,
    tint: "peach",
    categoryIds: ["deaf-world", "countries"],
    signIds: ["signlanguage", "asl", "america", "canada", "mexico", "france", "deaf", "language"],
    quickAnswer:
      "No. There are between 150 and 300 sign languages. ASL, BSL, and Auslan are different languages, even though their countries share English.",
    faq: [
      {
        q: "Is there a universal sign language?",
        a: "No. International Sign is a contact system used at international Deaf events, not a native language anyone grows up with.",
      },
      {
        q: "Is ASL used in other countries?",
        a: "ASL is used in the United States and English-speaking Canada, and it has influenced sign languages in parts of West Africa and Southeast Asia.",
      },
      {
        q: "How many sign languages are there?",
        a: "Linguists have catalogued over 150, and estimates run to 300 or more.",
      },
    ],
  },
  {
    slug: "does-duolingo-have-sign-language",
    title: "Does Duolingo Have Sign Language? No. Here's the Closest Thing",
    description:
      "Duolingo doesn't offer ASL or any sign language. Here's why, whether that might change, and the closest Duolingo-style way to learn ASL.",
    keyword: "does duolingo have sign language",
    publishedAt: "2026-11-01",
    updatedAt: "2026-11-01",
    minutes: 4,
    tint: "blue",
    categoryIds: ["greetings", "deaf-world"],
    signIds: ["hello", "thankyou", "please", "learn", "practice", "signlanguage", "asl", "deaf"],
    quickAnswer:
      "No. As of November 2026, Duolingo does not offer American Sign Language (ASL), British Sign Language (BSL), or any other sign language. If you want Duolingo-style learning for ASL, with short daily lessons, a path, and streaks, Ziggy is built for exactly that, with real signers on video for every sign. It's a subscription with a free trial.",
    faq: [
      {
        q: "Does Duolingo have ASL?",
        a: "No. Duolingo has no American Sign Language course, and no sign language courses at all.",
      },
      {
        q: "Is there a Duolingo for sign language?",
        a: "Not from Duolingo itself. Ziggy is the closest match: short daily lessons, a path, and streaks, built only for ASL with real signers.",
      },
      {
        q: "Does Duolingo have BSL?",
        a: "No. Duolingo doesn't teach British Sign Language either.",
      },
      {
        q: "Can I learn sign language for free?",
        a: "You can learn the basics free with Ziggy's online dictionary and guides, or with SignSchool. For a structured daily course, Ziggy offers a free trial.",
      },
    ],
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

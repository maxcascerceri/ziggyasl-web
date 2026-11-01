// Facts behind /best-asl-apps and /compare/*. Every competitor statement must
// match a listed source (the company's own site or store listing, or a dated
// review quoted as such). Re-check each quarter and bump CHECKED_AT.

import type { FAQItem } from "@/components/FAQ";

export const CHECKED_AT = "2026-11-01";
export const CHECKED_LABEL = "November 2026";

export type AppId = "ziggy" | "lingvano" | "the-asl-app" | "signschool" | "hands-on-asl";

export type ReviewedApp = {
  id: AppId;
  name: string;
  /** Short label used in headings, e.g. "best overall for beginners". */
  award: string;
  bestFor: string;
  howItWorks: string;
  platforms: string;
  summary: string[];
  good: string[];
  keepInMind: string[];
  url: string;
  sources: string[];
};

/** Ranked order is the order of this array. */
export const APPS: ReviewedApp[] = [
  {
    id: "ziggy",
    name: "Ziggy",
    award: "best overall for beginners",
    bestFor: "Beginners building a daily ASL habit",
    howItWorks: "Subscription with a free trial",
    platforms: "iOS, Android",
    summary: [
      "Ziggy teaches ASL in short video lessons you can finish in a few minutes. Every sign is filmed with a real signer, not animation or illustrations, and our team includes certified ASL interpreters who sign our videos and check our signs. Your learning path picks up right where you left off, recognition drills and spaced review bring signs back at the right moment, and streaks, stars, and small celebrations make the habit easy to keep.",
      "You can also study alongside the app for free on ziggyasl.com: a video dictionary of 700+ signs and phrases with notes on how each sign is made, plus beginner guides and a tool that fingerspells your name.",
    ],
    good: [
      "Real signers on every clip",
      "Short lessons that fit a few minutes a day",
      "Spaced review, flashcards, and quizzes",
      "Free web dictionary, guides, and name tool",
    ],
    keepInMind: [
      "A subscription is required after the free trial",
      "No camera feedback or live sessions",
      "ASL only",
    ],
    url: "https://www.ziggyasl.com",
    sources: ["https://www.ziggyasl.com/about"],
  },
  {
    id: "lingvano",
    name: "Lingvano",
    award: "best for a long structured course",
    bestFor: "A long structured course with camera practice",
    howItWorks: "Subscription with a free trial; a few lessons free",
    platforms: "iOS, Android, web",
    summary: [
      "Lingvano offers 600+ interactive lessons crafted and taught by Deaf teachers, with dialogues between Deaf signers, flashcards, a dictionary, and streaks. Its sign recognition feature uses your camera to check your fingerspelling, and it runs live group signing sessions led by Deaf tutors.",
    ],
    good: [
      "Large course taught by Deaf teachers",
      "Camera feedback on fingerspelling",
      "Live signing sessions with Deaf tutors",
      "Also teaches British and Austrian Sign Language",
    ],
    keepInMind: [
      "Only a few lessons are free before a subscription is required",
      "Some reviewers say they'd like harder quizzes",
    ],
    url: "https://www.lingvano.com/asl/",
    sources: [
      "https://www.lingvano.com/asl/",
      "https://www.lingvano.com/bsl",
      "https://apps.apple.com/us/app/lingvano-learn-sign-language/id1547252782",
      "https://play.google.com/store/apps/details?id=com.lingvano.app",
    ],
  },
  {
    id: "the-asl-app",
    name: "The ASL App",
    award: "best Deaf-made one-time purchase",
    bestFor: "Deaf-made vocabulary, paid once",
    howItWorks: "Free starter bundles; one-time purchase for the rest",
    platforms: "iOS, Android",
    summary: [
      "Made by Deaf people, The ASL App organizes 2,500+ signs and phrases into themed bundles, from the basics to dining, sports, and emergencies. It uses several signers, lets you drag on a video to control its speed, and has a favorites folder for signs you want to review.",
    ],
    good: [
      "Made by Deaf people",
      "Big vocabulary in themed bundles",
      "Free starter bundles, including the alphabet and numbers",
      "One purchase unlocks everything",
    ],
    keepInMind: [
      "Self-guided bundles rather than a lesson path",
      "You choose what to review, using a favorites folder",
    ],
    url: "https://theaslapp.com/",
    sources: [
      "https://theaslapp.com/",
      "https://theaslapp.com/bundles",
      "https://apps.apple.com/us/app/the-asl-app/id921030207",
      "https://play.google.com/store/apps/details?id=com.inkandsalt.aslapp",
    ],
  },
  {
    id: "signschool",
    name: "SignSchool",
    award: "best free option",
    bestFor: "Learning for free",
    howItWorks: "Free",
    platforms: "Web, iOS, Android",
    summary: [
      "SignSchool is free on the web and on mobile, with a dictionary of thousands of signs from a range of signers, courses by topic, grammar notes, a fingerspelling game, and a Sign of the Day.",
    ],
    good: ["Free", "Grammar explanations", "Courses by topic"],
    keepInMind: ["Less day-to-day structure than a guided app", "No feedback on your own signing"],
    url: "https://www.signschool.com/",
    sources: [
      "https://www.signschool.com/",
      "https://apps.apple.com/us/app/signschool/id1145529881",
      "https://play.google.com/store/apps/details?id=com.signschool.signschool",
    ],
  },
  {
    id: "hands-on-asl",
    name: "Hands On ASL",
    award: "best for fingerspelling",
    bestFor: "Fingerspelling practice",
    howItWorks: "Free with ads; small paid add-ons",
    platforms: "iOS",
    summary: [
      "Hands On ASL teaches the alphabet with 3D hand models you can rotate and zoom, plus fingerspelling quizzes with words of different lengths and speeds.",
    ],
    good: ["See every letter from any angle", "Quick, game-like practice"],
    keepInMind: ["Fingerspelling only", "Ads unless you pay to remove them"],
    url: "https://apps.apple.com/us/app/hands-on-asl/id1450898947",
    sources: ["https://apps.apple.com/us/app/hands-on-asl/id1450898947"],
  },
];

export function getApp(id: AppId): ReviewedApp {
  return APPS.find((a) => a.id === id)!;
}

export const TRADEMARK_NOTE =
  "Lingvano, The ASL App, SignSchool, Hands On ASL, and Duolingo are trademarks of their respective owners. Ziggy is not affiliated with or endorsed by any of them.";

export const BEST_APPS_FAQ: FAQItem[] = [
  {
    q: "What is the best app to learn sign language?",
    a: "For beginners learning ASL, our pick is Ziggy: short daily video lessons with real signers, a guided path, and spaced review. We make Ziggy, so weigh that. Lingvano is a good choice for a longer course with camera practice, and The ASL App if you'd rather pay once.",
  },
  {
    q: "Is there a free app to learn ASL?",
    a: "SignSchool is free. Ziggy's dictionary, guides, and name tool on ziggyasl.com are free with no sign-up; the Ziggy app is a subscription with a free trial.",
  },
  {
    q: "Can you really learn sign language from an app?",
    a: "You can learn vocabulary, fingerspelling, and basic grammar from an app. To become conversational, add practice with real people: a class, a tutor, or Deaf community events.",
  },
  {
    q: "Which sign language should I learn?",
    a: "The one used where you live. ASL is used in the United States and much of Canada. The UK uses British Sign Language, which is a different language.",
  },
  {
    q: "How long does it take to learn ASL with an app?",
    a: "With a few minutes a day, most beginners can fingerspell their name and sign a basic introduction within a week or two. A slow, friendly conversation takes a few months of daily practice. Fluency takes years.",
  },
];

export type Row = { label: string; ziggy: string; them: string };

export type Comparison = {
  slug: string;
  competitor: AppId;
  title: string;
  metaTitle: string;
  description: string;
  verdict: string;
  rows: Row[];
  ziggyStronger: { title: string; body: string }[];
  themStronger: { title: string; body: string }[];
  whoPicks: { who: string; pick: string }[];
  faq: FAQItem[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "ziggy-vs-lingvano",
    competitor: "lingvano",
    title: "Ziggy vs Lingvano",
    metaTitle: "Ziggy vs Lingvano: Which ASL App Is Right for You? (2026)",
    description:
      "An honest comparison of Ziggy and Lingvano for learning ASL: lessons, review, video, practice tools, and who each app is best for.",
    verdict:
      "Both are good ASL apps with real signers on video. Choose Ziggy if you want short, friendly lessons with spaced review, plus a free web dictionary and guides to study alongside. Choose Lingvano if you want a larger course with camera feedback on your fingerspelling and live signing sessions, or if you're learning BSL.",
    rows: [
      { label: "Real signers on video", ziggy: "Yes", them: "Yes, Deaf teachers" },
      { label: "Lessons", ziggy: "Short lessons, a few minutes a day", them: "600+ interactive lessons" },
      { label: "Learning path", ziggy: "Yes", them: "Yes" },
      { label: "Review", ziggy: "Spaced review, flashcards, recognition drills", them: "Flashcards and vocabulary, fingerspelling, and number practice" },
      { label: "Streaks and rewards", ziggy: "Yes", them: "Yes" },
      { label: "Camera feedback on your signing", ziggy: "No", them: "Yes, for fingerspelling" },
      { label: "Live sessions", ziggy: "No", them: "Yes, group sessions led by Deaf tutors" },
      { label: "Sign languages", ziggy: "ASL", them: "ASL, BSL, Austrian Sign Language" },
      { label: "Platforms", ziggy: "iOS, Android", them: "iOS, Android, web" },
      { label: "How it works", ziggy: "Subscription with a free trial", them: "Subscription with a free trial; a few lessons free" },
    ],
    ziggyStronger: [
      { title: "Shorter, lighter sessions", body: "Lessons are built to fit a few minutes, which makes the daily habit easier to keep." },
      { title: "Spaced review", body: "Signs come back right before you'd forget them, alongside flashcards and recognition drills." },
      { title: "Free tools you can use anytime", body: "The ziggyasl.com dictionary has notes on how each sign is made, alongside the video, with no account. The sign-your-name tool and beginner guides are free too." },
      { title: "ASL only", body: "Everything in Ziggy is about American Sign Language." },
    ],
    themStronger: [
      { title: "A bigger course", body: "600+ lessons, including dialogues between Deaf signers." },
      { title: "Camera practice", body: "Sign recognition checks your fingerspelling and tells you if a letter is right." },
      { title: "Live sessions", body: "Group signing sessions led by Deaf tutors." },
      { title: "More than one sign language", body: "Lingvano also teaches British and Austrian Sign Language." },
    ],
    whoPicks: [
      { who: "New to ASL and want a habit that sticks", pick: "Ziggy" },
      { who: "Want camera feedback or live practice", pick: "Lingvano" },
      { who: "Learning BSL", pick: "Lingvano" },
      { who: "Not sure yet", pick: "Start with Ziggy's free dictionary and guides today, then try the app with a free trial" },
    ],
    faq: [
      {
        q: "Is Ziggy better than Lingvano?",
        a: "It depends on what you want. Ziggy is built around short daily lessons and spaced review; Lingvano offers a larger course, camera feedback on fingerspelling, and live signing sessions.",
      },
      {
        q: "Are Ziggy and Lingvano free?",
        a: "Both are subscriptions with a free trial, and Lingvano includes a few free lessons. Ziggy's website dictionary, guides, and name tool are free with no sign-up.",
      },
      {
        q: "Can I use both?",
        a: "Yes. Many learners pair an app with a free dictionary and a weekly class or meetup.",
      },
    ],
  },
  {
    slug: "ziggy-vs-the-asl-app",
    competitor: "the-asl-app",
    title: "Ziggy vs The ASL App",
    metaTitle: "Ziggy vs The ASL App: Which Should You Use to Learn ASL?",
    description:
      "Ziggy and The ASL App compared: a guided lesson path vs. themed bundles, review, video, and which fits how you want to learn.",
    verdict:
      "Choose Ziggy if you want a guided daily course: a learning path, spaced review, and streaks that keep you going. Choose The ASL App if you'd rather pay once and browse a large, Deaf-made collection of signs at your own pace.",
    rows: [
      { label: "Made by", ziggy: "The Ziggy Team, including certified ASL interpreters", them: "Deaf creators" },
      { label: "Real signers on video", ziggy: "Yes", them: "Yes, several signers" },
      { label: "Structure", ziggy: "Guided learning path", them: "Themed bundles you browse" },
      { label: "Review", ziggy: "Spaced review, flashcards, recognition drills", them: "Favorites folder" },
      { label: "Vocabulary", ziggy: "700+ signs and phrases", them: "2,500+ signs and phrases" },
      { label: "Slow motion", ziggy: "Yes, on the web", them: "Yes, drag to control speed" },
      { label: "Platforms", ziggy: "iOS, Android", them: "iOS, Android" },
      { label: "How it works", ziggy: "Subscription with a free trial", them: "Free starter bundles; one-time purchase for the rest" },
    ],
    ziggyStronger: [
      { title: "It tells you what to learn next", body: "You don't have to plan your own path." },
      { title: "It brings signs back", body: "Spaced review and drills turn signs you've seen into signs you know." },
      { title: "It keeps you coming back", body: "Streaks and small wins make a few minutes a day easy." },
      { title: "Free web tools", body: "A free dictionary with notes on how each sign is made, beginner guides, and a sign-your-name tool on ziggyasl.com." },
    ],
    themStronger: [
      { title: "Made by Deaf people", body: "The content comes from the Deaf community." },
      { title: "A bigger vocabulary", body: "Themed bundles like dining, sports, and emergencies." },
      { title: "Pay once", body: "Free starter bundles, then one purchase unlocks everything, with no subscription." },
    ],
    whoPicks: [
      { who: "Want a course and a daily habit", pick: "Ziggy" },
      { who: "Want a big phrasebook to browse, paid once", pick: "The ASL App" },
      { who: "Want both", pick: "Use a guided app to learn and a phrasebook to look things up" },
    ],
    faq: [
      {
        q: "Is The ASL App free?",
        a: "It has free starter bundles, including the alphabet and numbers, and a one-time purchase unlocks the rest.",
      },
      {
        q: "Is Ziggy a one-time purchase?",
        a: "No. Ziggy is a subscription with a free trial. Its website dictionary, guides, and name tool are free.",
      },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

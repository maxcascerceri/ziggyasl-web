// Registry for the /learn pillar guides. Body copy lives in
// src/content/learn/{slug}.mdx; this file holds metadata, the ordered clip
// sequence, and the practice set so the footer, hub, and sitemap stay in sync.

export type LearnGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Primary query the page targets; used in the H1 eyebrow and meta. */
  keyword: string;
  /** Ordered sign ids embedded as the "watch along" sequence. */
  signIds: string[];
  /** Category the guide maps to, for cross-links. */
  categoryId?: string;
  /** Approximate reading time in minutes. */
  minutes: number;
  tint: "blue" | "mint" | "yellow" | "peach";
  publishedAt: string;
  updatedAt: string;
};

export const LEARN_GUIDES: LearnGuide[] = [
  {
    slug: "asl-alphabet",
    title: "The ASL Alphabet: Fingerspelling A to Z (with video)",
    shortTitle: "ASL Alphabet",
    description:
      "Learn all 26 letters of the American Sign Language alphabet with real video for every handshape, the letters beginners mix up, and how to fingerspell your name smoothly.",
    keyword: "ASL alphabet",
    signIds: [
      "a", "b", "c", "d", "e", "f", "g", "h", "letteri", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ],
    categoryId: "alphabet",
    minutes: 9,
    tint: "blue",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-numbers",
    title: "ASL Numbers 1 to 100: How to Count in Sign Language",
    shortTitle: "ASL Numbers",
    description:
      "Count from zero to one hundred in ASL. Video for every number, the palm-orientation rule that trips up beginners, and the patterns that make 20 to 99 easy.",
    keyword: "ASL numbers",
    signIds: [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
      "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twentyone",
      "twentyfive", "thirty", "forty", "fifty", "sixty", "seventy", "eighty",
      "ninety", "thousand",
    ],
    categoryId: "numbers",
    minutes: 8,
    tint: "mint",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "basic-asl-phrases",
    title: "25 Basic ASL Phrases Every Beginner Should Know",
    shortTitle: "Basic Phrases",
    description:
      "The first phrases you actually use in a signed conversation: introductions, asking for help, saying you are learning, and keeping things polite. Real video for each one.",
    keyword: "basic ASL phrases",
    signIds: [
      "hello", "mynameis", "nicetomeetyou", "howareyou", "imfine", "imgood",
      "thankyou", "yourewelcome", "please", "sorry", "excuseme", "yes", "no",
      "dontknow", "imlearningasl", "isignalittle", "signslow", "signagain",
      "idontunderstand", "whatdoesthatmean", "howyousignthat", "canyouhelpme",
      "wherebathroom", "seeyoulater", "havegoodday",
    ],
    categoryId: "asl-phrases",
    minutes: 10,
    tint: "yellow",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-greetings",
    title: "ASL Greetings: Hello, Goodbye, and Introductions",
    shortTitle: "Greetings",
    description:
      "How to say hello, goodbye, good morning, and nice to meet you in ASL, plus the etiquette of getting someone's attention before you sign.",
    keyword: "ASL greetings",
    signIds: [
      "hello", "goodmorning", "goodnight", "bye", "seeyoulater",
      "seeyoutomorrow", "nicetomeetyou", "nicetoseeyou", "mynameis",
      "whatisyourname", "howareyou", "imfine", "welcome", "havegoodday",
      "talktoyoulater",
    ],
    categoryId: "greetings",
    minutes: 7,
    tint: "peach",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-question-words",
    title: "ASL Question Words: What, Where, When, Who, Why, How",
    shortTitle: "Question Words",
    description:
      "The six WH-question signs, where they go in an ASL sentence, and the eyebrow rule that makes a question a question. Video for each sign and full question phrases.",
    keyword: "ASL question words",
    signIds: [
      "what", "where", "when", "who", "why", "how", "which", "howmany",
      "whatisyourname", "whereareyoufrom", "whatareyoudoing", "howoldareyou",
      "whathappened", "whatsthat", "whereareyou",
    ],
    categoryId: "questions",
    minutes: 8,
    tint: "blue",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-pronouns",
    title: "ASL Pronouns: I, Me, You, We, They (and Why Me Is the Same as I)",
    shortTitle: "Pronouns",
    description:
      "Pointing is grammar in ASL. Learn the personal and possessive pronouns, why I and ME share one sign, and how to set up people in space so your sentences make sense.",
    keyword: "ASL pronouns",
    signIds: ["i", "you", "he", "we", "they", "my", "your", "his", "our", "their"],
    categoryId: "pronouns",
    minutes: 7,
    tint: "mint",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-colors",
    title: "Colors in ASL: Red, Blue, Green, and Every Color You Need",
    shortTitle: "Colors",
    description:
      "Fourteen color signs with video, the handshape pattern that links most of them, and a short practice set you can do in two minutes.",
    keyword: "colors in ASL",
    signIds: [
      "red", "blue", "green", "yellow", "orangecolor", "purple", "pink",
      "brown", "black", "white", "gray", "gold", "silver", "bright",
    ],
    categoryId: "colors",
    minutes: 6,
    tint: "yellow",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-family-signs",
    title: "Family Signs in ASL: Mother, Father, Sister, Brother, and More",
    shortTitle: "Family",
    description:
      "The ASL family signs share one simple rule about the forehead and chin. Learn mother, father, grandparents, siblings, and cousins with video and memory hooks.",
    keyword: "family signs in ASL",
    signIds: [
      "mother", "father", "parents", "grandmother", "grandfather", "sister",
      "brother", "baby", "child", "family", "aunt", "uncle", "cousin",
      "niece", "nephew", "twins",
    ],
    categoryId: "family",
    minutes: 7,
    tint: "peach",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-feelings",
    title: "Feelings in ASL: Happy, Sad, Tired, and How Your Face Does Half the Work",
    shortTitle: "Feelings",
    description:
      "Emotion signs are where facial expression stops being optional. Learn the core feeling signs, the full phrases like I'm tired, and how to match your face to the sign.",
    keyword: "feelings in ASL",
    signIds: [
      "happy", "sad", "tired", "angry", "scared", "excited", "nervous",
      "worry", "good", "bad", "fine", "great", "bored", "lonely", "surprise",
      "imhappy", "imtired", "imsad",
    ],
    categoryId: "mood-basics",
    minutes: 8,
    tint: "blue",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "days-of-the-week-asl",
    title: "Days of the Week and Time in ASL",
    shortTitle: "Days & Time",
    description:
      "Monday through Sunday in ASL, plus today, tomorrow, yesterday, and the timeline that runs over your shoulder. Video for every sign.",
    keyword: "days of the week in ASL",
    signIds: [
      "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
      "sunday", "weekend", "today", "tomorrow", "yesterday", "now", "morning",
      "afternoon", "night", "week", "month", "year",
    ],
    categoryId: "weekdays",
    minutes: 7,
    tint: "mint",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "asl-food-signs",
    title: "Food and Mealtime Signs in ASL",
    shortTitle: "Food & Mealtime",
    description:
      "Eat, drink, hungry, breakfast, lunch, dinner, and the everyday foods you will actually sign about. Real video, the EAT family of signs, and ordering-at-a-table practice.",
    keyword: "food signs in ASL",
    signIds: [
      "hungry", "thirsty", "breakfast", "lunch", "dinner", "full", "delicious",
      "imhungry", "iwanteat", "iwantdrink", "water", "coffee", "tea", "juice",
      "apple", "banana", "bread", "pizza", "cake", "chocolate",
    ],
    categoryId: "mealtime",
    minutes: 8,
    tint: "yellow",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
  {
    slug: "deaf-culture-basics",
    title: "Deaf Culture Basics for New ASL Learners",
    shortTitle: "Deaf Culture",
    description:
      "What every hearing beginner should know before their first signed conversation: Deaf with a capital D, name signs, eye contact, interpreters, and the signs for all of it.",
    keyword: "Deaf culture basics",
    signIds: [
      "deaf", "hearing", "hardofhearing", "asl", "signlanguage", "deafculture",
      "namesign", "whatisyournamesign", "interpreter", "caption", "hearingaid",
      "lipread", "imlearningasl", "isignalittle", "fluent", "silentapplause",
    ],
    categoryId: "deaf-world",
    minutes: 9,
    tint: "peach",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
  },
];

export function getGuide(slug: string): LearnGuide | undefined {
  return LEARN_GUIDES.find((g) => g.slug === slug);
}

export function guideForCategory(categoryId: string): LearnGuide | undefined {
  return LEARN_GUIDES.find((g) => g.categoryId === categoryId);
}

/** Best guide to recommend from a sign page, by category then fallback. */
export function guideForSign(categoryIds: string[]): LearnGuide {
  for (const id of categoryIds) {
    const g = guideForCategory(id);
    if (g) return g;
  }
  return LEARN_GUIDES[2];
}

// Registry for the /learn pillar guides. Body copy lives in
// src/content/learn/{slug}.mdx; this file holds metadata, the ordered clip
// sequence, and the practice set so the footer, hub, and sitemap stay in sync.

import type { FAQItem } from "@/components/FAQ";

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
  /** One-paragraph answer shown above the article and quoted by search and AI answers. */
  quickAnswer?: string;
  /** Visible FAQ after the article, also emitted as FAQPage structured data. */
  faq?: FAQItem[];
  /** How-to-learn guides teach a process, not a sign set, so CTAs stay generic. */
  howTo?: boolean;
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "The ASL alphabet is 26 one-handed handshapes, one per letter, used to spell names, places, and words you don't have a sign for yet. Hold your hand at shoulder height, palm toward the person you're talking to, and keep your wrist still while only your fingers move. Most people can learn all 26 letters in a few days.",
    faq: [
      {
        q: "How long does it take to learn the ASL alphabet?",
        a: "Most people learn all 26 letters in a few days. Spelling and reading at a natural speed takes longer, with regular practice.",
      },
      {
        q: "Is the ASL alphabet one-handed?",
        a: "Yes. ASL fingerspelling uses one hand. British Sign Language uses a two-handed alphabet.",
      },
      {
        q: "How do you fingerspell double letters in ASL?",
        a: "Make the letter, then slide it slightly to the side for the second one, like the two Ls in Molly.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "ASL numbers are signed on one hand. Count one to five with the palm facing you, starting from the index finger (three is thumb, index, and middle finger). Six to nine touch the thumb to a different finger: pinky for six, ring for seven, middle for eight, index for nine. The teens and tens follow patterns, so 20 to 99 are quick to learn.",
    faq: [
      {
        q: "How do you sign 3 in ASL?",
        a: "Hold up your thumb, index, and middle finger. It's not the three fingers you'd hold up in a restaurant.",
      },
      {
        q: "How do you sign 6 through 9 in ASL?",
        a: "Touch your thumb to one finger with the others up: pinky for six, ring finger for seven, middle finger for eight, index finger for nine.",
      },
      {
        q: "How do you sign your age in ASL?",
        a: "Ages are signed at the chin: the sign OLD followed by the number, or the number starting from the chin.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "The first ASL phrases to learn are the ones from a first conversation: MY NAME plus your fingerspelled name, NICE TO MEET YOU, HOW ARE YOU, THANK YOU, PLEASE, SORRY, I'M LEARNING ASL, SIGN SLOW, and SIGN AGAIN. ASL phrases drop English filler words, so learn each one as a single rhythm.",
    faq: [
      {
        q: "How do you say \"my name is\" in ASL?",
        a: "Sign MY NAME, then fingerspell your name. ASL drops the word \"is.\"",
      },
      {
        q: "Is it rude to ask someone to sign slower?",
        a: "No. SIGN SLOW and SIGN AGAIN are the same as saying \"pardon?\" in English, and people will use them with you too.",
      },
      {
        q: "How do you say \"I'm learning ASL\"?",
        a: "Sign I'M LEARNING ASL. It's a good opener in any Deaf space, because it sets expectations.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "To greet someone in ASL, first get their attention with a wave in their line of sight or a light tap on the shoulder. Then sign HELLO, a salute that opens outward from the forehead or a simple wave. A full introduction is HELLO, MY NAME and your fingerspelled name, then NICE TO MEET YOU.",
    faq: [
      {
        q: "How do you say hello in ASL?",
        a: "Sign HELLO with a salute that opens outward from the forehead, or just a friendly wave. Both are common.",
      },
      {
        q: "How do you say goodbye in ASL?",
        a: "Wave, often with the fingers folding down. SEE YOU LATER and SEE YOU TOMORROW are common too.",
      },
      {
        q: "How do you introduce yourself in ASL?",
        a: "HELLO, MY NAME, fingerspell your name, then NICE TO MEET YOU.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "ASL has six main question words: WHAT, WHERE, WHEN, WHO, WHY, and HOW. Sign them with lowered eyebrows, and usually put the question word at the end: \"Where is the bathroom?\" is BATHROOM WHERE. Yes-or-no questions use raised eyebrows instead, with no extra signs.",
    faq: [
      {
        q: "Where does the question word go in ASL?",
        a: "Usually at the end of the sentence. \"What's your name?\" is YOUR NAME WHAT.",
      },
      {
        q: "How do you ask a yes-or-no question in ASL?",
        a: "Raise your eyebrows while you sign the statement. YOU DEAF with raised eyebrows means \"Are you Deaf?\"",
      },
      {
        q: "Why do eyebrows matter for ASL questions?",
        a: "They're the grammar. Lowered eyebrows mark who/what/where questions; raised eyebrows mark yes-or-no questions. Without them, a question reads as a statement.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "ASL pronouns are pointing. Point at yourself for I or ME, at the other person for YOU, and at a spot to the side for HE, SHE, or IT. The sign doesn't change for gender or for subject versus object. Possessives like MY and YOUR use a flat hand instead of a pointing finger.",
    faq: [
      {
        q: "How do you sign \"me\" in ASL?",
        a: "Point to your chest. I and ME are the same sign in ASL.",
      },
      {
        q: "Does ASL have different signs for he and she?",
        a: "No. Point to a spot to the side for he, she, or it. Gender comes from context.",
      },
      {
        q: "How do you sign \"my\" in ASL?",
        a: "Place a flat hand on your chest. Possessives use a flat hand; pronouns use a pointing finger.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "Many ASL colors are the first letter of the English word, shaken with a small twist of the wrist: B for blue, G for green, Y for yellow, P for purple. Others are made on the face: RED brushes the index finger down over the lips, and BLACK draws an index finger across the forehead.",
    faq: [
      {
        q: "How do you sign blue in ASL?",
        a: "Make the letter B and shake it with a small twist of the wrist.",
      },
      {
        q: "How do you sign red in ASL?",
        a: "Brush your index finger down over your lips.",
      },
      {
        q: "Where does the color go in an ASL sentence?",
        a: "Usually after the noun. \"A red car\" is CAR RED.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "ASL family signs follow one rule: female signs are made at the chin and male signs at the forehead. MOTHER is an open hand with the thumb tapping the chin, and FATHER is the same hand tapping the forehead. Learn the rule and you can guess most family signs.",
    faq: [
      {
        q: "How do you sign mom in ASL?",
        a: "Tap the thumb of an open hand on your chin. That's MOTHER.",
      },
      {
        q: "How do you sign dad in ASL?",
        a: "Tap the thumb of an open hand on your forehead. That's FATHER.",
      },
      {
        q: "Why are female signs at the chin and male signs at the forehead?",
        a: "The pattern comes from old-fashioned headwear: a man's hat brim at the forehead and a woman's bonnet string at the chin.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "Feeling signs in ASL depend on your face as much as your hands. HAPPY brushes open hands up the chest with a smile; SAD draws open hands down in front of a falling face. ASL rarely uses VERY: make the sign bigger, faster, and more expressive to show intensity.",
    faq: [
      {
        q: "How do you sign happy in ASL?",
        a: "Brush open hands up your chest, with a smile. The face is part of the sign.",
      },
      {
        q: "How do you say \"very\" in ASL?",
        a: "Usually you don't. Make the sign bigger, faster, and more expressive instead.",
      },
      {
        q: "How do you answer \"how are you\" in ASL?",
        a: "With a feeling sign like FINE or GOOD, and let your face show how you really are.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "Most ASL days of the week are the first letter of the English word, circled in front of you with the palm facing out: M for Monday, T for Tuesday, W for Wednesday, F for Friday, S for Saturday. Thursday is a T that flicks to an H, and Sunday is two open hands circling outward.",
    faq: [
      {
        q: "How do you sign Thursday in ASL?",
        a: "Make a T that flicks to an H. It's the one day that uses two letters.",
      },
      {
        q: "How do you sign tomorrow and yesterday in ASL?",
        a: "TOMORROW moves a thumb forward from the cheek, into the future. YESTERDAY moves it back toward your shoulder, into the past.",
      },
      {
        q: "How does time work in ASL?",
        a: "Time lives on a line through your body: behind you is the past, in front of you is now, and further ahead is the future.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "Most ASL food signs look like eating or holding the food. EAT brings a flattened O handshape to the mouth, and breakfast, lunch, and dinner are EAT plus MORNING, NOON, or NIGHT. DRINK tips a C handshape to the mouth like a cup, and WATER taps a W on the chin.",
    faq: [
      {
        q: "How do you sign eat in ASL?",
        a: "Bring a flattened O handshape to your mouth, as if putting food in.",
      },
      {
        q: "How do you sign water in ASL?",
        a: "Tap the letter W on your chin.",
      },
      {
        q: "How do you sign breakfast, lunch, and dinner?",
        a: "EAT followed by MORNING, NOON, or NIGHT.",
      },
    ],
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
    updatedAt: "2026-11-01",
    quickAnswer:
      "Deaf with a capital D refers to the community that shares ASL and Deaf culture. To get a Deaf person's attention, wave in their line of sight or tap their shoulder lightly. Keep eye contact while someone is signing, don't grab someone's hands, and don't give yourself a name sign; Deaf people give them.",
    faq: [
      {
        q: "What does capital-D Deaf mean?",
        a: "Deaf with a capital D refers to people who identify with Deaf culture and use ASL. Lowercase deaf describes not hearing.",
      },
      {
        q: "How do you get a Deaf person's attention?",
        a: "Wave in their line of sight, tap their shoulder lightly, flick the lights in a room, or stomp on a wooden floor. All of these are normal.",
      },
      {
        q: "What is a name sign?",
        a: "A personal sign that stands in for fingerspelling your name. Deaf people give name signs; until you have one, fingerspell your name.",
      },
    ],
  },
  {
    slug: "how-to-learn-sign-language",
    title: "How to Learn Sign Language: A Step-by-Step Guide for Beginners (ASL)",
    shortTitle: "How to Learn Sign Language",
    description:
      "How to learn American Sign Language from zero: the right order, a 30-day starter plan, free resources, and how to practice with real people.",
    keyword: "how to learn sign language",
    signIds: [
      "hello", "nicetomeetyou", "mynameis", "please", "thankyou", "sorry",
      "yes", "no", "understand", "what", "where", "who", "imlearningasl", "signslow",
    ],
    minutes: 8,
    tint: "blue",
    publishedAt: "2026-11-01",
    updatedAt: "2026-11-01",
    howTo: true,
    quickAnswer:
      "Choose the sign language used where you live (ASL in the US and most of Canada), learn the alphabet and about 50 core signs, then practice a few minutes every day with video of real signers. Learn facial expressions and basic grammar early, and sign with real people as soon as you can: a class, a tutor, or a Deaf community event.",
    faq: [
      {
        q: "Can I teach myself sign language?",
        a: "You can teach yourself the alphabet, vocabulary, and basic grammar with video, an app, and free guides. To get conversational, add practice with real signers.",
      },
      {
        q: "What's the easiest way to learn sign language?",
        a: "Short daily practice with real-signer video, starting with signs you'll use right away. An app gives you the structure; a class gives you feedback.",
      },
      {
        q: "What's the best app to learn sign language?",
        a: "We compared the main options on our best ASL apps page. For beginners, our pick is Ziggy (we make it, so we're biased).",
      },
      {
        q: "Is ASL hard to learn?",
        a: "The first signs are easy and satisfying. What takes time is grammar and facial expression, which work differently from English. Both are very learnable.",
      },
      {
        q: "Can I learn sign language online for free?",
        a: "Yes. Ziggy's dictionary, guides, and name tool are free with no sign-up, and SignSchool and Lifeprint offer free lessons.",
      },
    ],
  },
  {
    slug: "learn-sign-language-online-free",
    title: "How to Learn Sign Language Online for Free (ASL Resources That Work)",
    shortTitle: "Learn ASL Online Free",
    description:
      "The best free ways to learn ASL online: video dictionaries, beginner guides, fingerspelling tools, and how to practice with real people at no cost.",
    keyword: "learn sign language online free",
    signIds: ["hello", "mynameis", "nicetomeetyou", "thankyou", "please", "imlearningasl", "learn", "practice"],
    minutes: 5,
    tint: "mint",
    publishedAt: "2026-11-01",
    updatedAt: "2026-11-01",
    howTo: true,
    quickAnswer:
      "You can learn the basics of ASL online for free. Use a video dictionary to look up signs, follow free guides for the alphabet, numbers, and first phrases, and practice with real signers at free community events. Ziggy's dictionary, guides, and name tool are free with no sign-up.",
    faq: [
      {
        q: "Is there a completely free way to learn ASL?",
        a: "Yes, for the basics: free dictionaries, guides, SignSchool, Lifeprint, and community events. Becoming conversational takes regular practice with real signers.",
      },
      {
        q: "Is Ziggy free?",
        a: "The dictionary, guides, and name tool on this site are free. The Ziggy app is a subscription with a free trial.",
      },
      {
        q: "What should I learn first?",
        a: "The alphabet, then greetings and basic phrases. With those you can fingerspell your name and introduce yourself.",
      },
    ],
  },
  {
    slug: "how-to-learn-asl-fast",
    title: "How to Learn ASL Fast: 8 Habits That Actually Speed You Up",
    shortTitle: "Learn ASL Fast",
    description:
      "The fastest way to learn American Sign Language: short daily practice, spaced review, learning in phrases, and signing with real people.",
    keyword: "how to learn ASL fast",
    signIds: ["mynameis", "nicetomeetyou", "please", "thankyou", "yes", "no", "signslow", "again", "practice"],
    minutes: 4,
    tint: "yellow",
    publishedAt: "2026-11-01",
    updatedAt: "2026-11-01",
    howTo: true,
    quickAnswer:
      "The fastest way to learn ASL is short daily practice, not long weekend sessions: ten minutes a day of real-signer video, reviewing signs right before you'd forget them, learning signs in phrases, using your face from day one, and signing with a real person every week.",
    faq: [
      {
        q: "Can I learn ASL in a month?",
        a: "In a month of daily practice you can learn about 100 signs, fingerspell, introduce yourself, and ask simple questions. Conversation takes a few months; fluency takes years.",
      },
      {
        q: "How many minutes a day should I practice ASL?",
        a: "Ten to fifteen minutes a day is enough to make steady progress. Daily beats long and occasional.",
      },
      {
        q: "What's the fastest way to learn ASL vocabulary?",
        a: "Learn signs in phrases and groups, from video, and review them on a schedule that brings each sign back right before you'd forget it.",
      },
    ],
  },
  {
    slug: "asl-classes-vs-apps",
    title: "ASL Classes vs Apps: Which Is Better for Learning Sign Language?",
    shortTitle: "Classes vs Apps",
    description:
      "Should you learn ASL with a class or an app? An honest comparison of cost, feedback, schedule, and results, and the combination that works best.",
    keyword: "ASL classes vs apps",
    signIds: ["hello", "mynameis", "imlearningasl", "class", "learn", "practice", "understand", "signslow"],
    minutes: 4,
    tint: "peach",
    publishedAt: "2026-11-01",
    updatedAt: "2026-11-01",
    howTo: true,
    quickAnswer:
      "Use both. Apps are the best way to build vocabulary and practice every day. Classes, especially with a Deaf teacher, give you feedback on your own signing and real conversation. Most learners get the best results from a daily app plus a weekly class or community event.",
    faq: [
      {
        q: "Can I learn ASL with just an app?",
        a: "You can learn vocabulary, fingerspelling, and basic grammar from an app. To become conversational, add practice with real people.",
      },
      {
        q: "Are online ASL classes worth it?",
        a: "Yes, if they're live and give you feedback on your signing. Recorded-only courses are closer to an app.",
      },
      {
        q: "Should I learn some ASL before taking a class?",
        a: "It helps. Knowing the alphabet and a few greetings makes the first class easier to follow.",
      },
    ],
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

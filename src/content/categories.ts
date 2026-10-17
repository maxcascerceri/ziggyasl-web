// Teacher-written intros for each dictionary category. Keyed by category id
// from catalog.json. `seoTitle` is the H1 / <title> target phrase; `intro`
// is the paragraph under it; `tip` is the one-line coaching note.

export type CategoryCopy = {
  seoTitle: string;
  intro: string;
  tip?: string;
};

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  greetings: {
    seoTitle: "ASL Greetings and First Signs",
    intro:
      "These are the first twenty signs we teach, and the ones you will use in every conversation for the rest of your signing life. Hello, thank you, please, sorry, and the short introductions that follow them. Learn them in this order and you can greet a Deaf person politely by the end of the day.",
    tip: "Get the person's eyes before you sign hello. A small wave in their line of sight is the ASL equivalent of saying their name.",
  },
  responses: {
    seoTitle: "ASL Replies: Yes, No, OK, and Quick Responses",
    intro:
      "Conversations are mostly small replies. Yes, no, sure, really, wait, never mind. These signs keep a chat moving and show you are following along. Most are one quick motion, and most of them lean on your face to carry the tone.",
    tip: "Nod with YES and shake with NO. The head movement is part of the sign, not an extra.",
  },
  "casual-talk": {
    seoTitle: "Casual ASL Slang and Everyday Expressions",
    intro:
      "ASL has its own slang, and it is not a translation of English slang. These are expressions you will see among Deaf friends and online: ways to say someone is talking too much, that something is top tier, or that a problem is not yours. Use them once you are comfortable, and watch how native signers use them first.",
    tip: "Slang lives in the face and the rhythm. Copy the attitude, not just the handshape.",
  },
  pronouns: {
    seoTitle: "ASL Pronouns: I, Me, You, We, They, and Possessives",
    intro:
      "In ASL, pronouns are pointing with grammar. I and ME are one sign. HE, SHE, and HIM are one sign. Possessives like MY and YOUR use a flat hand instead of a finger. This category groups each shared production into one card so you learn ten signs, not nineteen English words.",
    tip: "Where you point matters. Set a person up in space once, then point back to that spot every time you mean them.",
  },
  questions: {
    seoTitle: "ASL Question Words: What, Where, When, Who, Why, How",
    intro:
      "The six WH-signs plus the full questions you will ask on day one: what is your name, where are you from, how old are you. In ASL the question word usually comes at the end of the sentence, and your eyebrows go down for WH-questions. Both halves matter.",
    tip: "Eyebrows down for WH-questions, up for yes-or-no questions. Without the eyebrows it reads as a statement.",
  },
  "people-words": {
    seoTitle: "ASL Signs for Person, People, and Introducing Yourself",
    intro:
      "The signs you need to talk about people in general and to introduce yourself. PERSON uses a handshape you will see again in words like LAWYER and TEACHER, so it is worth learning early.",
  },
  "mood-basics": {
    seoTitle: "ASL Feelings: Happy, Sad, Tired, and How You Feel",
    intro:
      "Feelings are where facial expression stops being optional. HAPPY with a blank face is not finished. This category covers the core emotion signs, the good-bad-fine scale for answering how are you, and the full phrases like I'm tired so you can answer honestly.",
    tip: "Make the face first, then the sign. Your expression should start a beat before your hands move.",
  },
  "deaf-world": {
    seoTitle: "Deaf Culture Signs: Deaf, Hearing, ASL, Interpreter",
    intro:
      "Before anything else, learn how to talk about the language and the community you are stepping into. DEAF, HEARING, HARD-OF-HEARING, ASL, INTERPRETER, and the humble, useful phrase I'm learning ASL. These signs earn you patience from native signers and show respect from your first conversation.",
    tip: "Say I'm learning ASL early in a conversation. Deaf people are almost always glad to slow down for someone who is trying.",
  },
  alphabet: {
    seoTitle: "ASL Alphabet: Fingerspelling A to Z",
    intro:
      "All twenty-six letters of the American manual alphabet on video. Fingerspelling fills every gap in your vocabulary, so this is the one category every learner needs to finish. Hold your hand steady at shoulder height, palm facing out, and move only your fingers.",
    tip: "Mouth the whole word while you spell it, not each letter. It is how fluent signers spell and how readers understand you.",
  },
  fingerspelling: {
    seoTitle: "ASL Signs About Fingerspelling, Letters, and Words",
    intro:
      "The signs you use to talk about spelling itself: FINGERSPELL, ALPHABET, LETTER, WORD, LANGUAGE, and NAME. Learn these so you can ask someone to spell a word or tell them you need a name spelled out.",
  },
  numbers: {
    seoTitle: "ASL Numbers 0 to 100",
    intro:
      "Counting in ASL is done on one hand and has a few rules English does not. Numbers one through five face you, six through nine are a thumb touching a finger, and the teens and tens have patterns that make the whole set learnable in an afternoon. Every number here is on video.",
    tip: "Palm faces you for 1 to 5 when counting, and faces out when giving an age, a time, or a count of people.",
  },
  money: {
    seoTitle: "ASL Money Signs: Pay, Cost, Dollars, and Cash",
    intro:
      "Money, pay, cost, price, dollars, card, and cash. Dollar amounts in ASL twist the number sign to show dollars, so ONE-DOLLAR and FIVE-DOLLARS are worth watching closely. Pair these with Numbers and you can handle a checkout.",
  },
  "amounts-math": {
    seoTitle: "ASL Signs for Amounts, Fractions, and Math",
    intro:
      "Half, quarter, percent, double, hundred, many, few. The signs that answer how much and how many. Several use the same number handshapes you learned in Numbers, just placed or moved differently.",
  },
  "sentence-helpers": {
    seoTitle: "ASL Conjunctions and Sentence Helpers: And, But, Or, Because",
    intro:
      "ASL uses fewer little words than English, but these are the ones that survive: AND, BUT, OR, SO, WITH, WITHOUT, BECAUSE. Learn them to link ideas, then learn when to leave them out, because a pause and a shift of your body often does the same job.",
    tip: "Do not sign every English word. If you find yourself signing AND three times in one sentence, you are translating instead of signing.",
  },
  family: {
    seoTitle: "ASL Family Signs: Mother, Father, Sister, Brother",
    intro:
      "The family signs share a beautiful logic. Female signs sit at the chin, male signs sit at the forehead, and the same handshapes repeat across MOTHER, FATHER, GRANDMOTHER, GRANDFATHER, AUNT, UNCLE, and more. Learn the rule and the whole category comes fast.",
    tip: "Chin for female, forehead for male. If you forget a family sign, start from the right location and you will usually land on it.",
  },
  people: {
    seoTitle: "ASL Signs for Man, Woman, Boy, Girl, and Ages",
    intro:
      "The basic people words: man, woman, boy, girl, adult, teenager, old, young. These share the same chin-and-forehead logic as the family signs, so learn them together.",
  },
  movement: {
    seoTitle: "ASL Movement Verbs: Go, Come, Walk, Run, Stop",
    intro:
      "Movement verbs in ASL often move in the direction of the action. GO moves away from you, COME moves toward you. Watch where the signer's hands travel, not just what shape they make.",
  },
  "body-actions": {
    seoTitle: "ASL Signs for Eat, Drink, Sleep, See, Hear",
    intro:
      "The verbs you do with your body. EAT, DRINK, SLEEP, SEE, HEAR, FEEL, BREATHE, SMELL. Most of these are iconic, which means they look like what they mean, so they are among the fastest signs to remember.",
  },
  communication: {
    seoTitle: "ASL Communication Signs: Tell, Ask, Know, Understand",
    intro:
      "Tell, ask, talk, think, know, understand, believe, need. The signs you use to talk about talking. Several of these are directional, meaning ASK-ME and ASK-YOU are the same sign moving in different directions. That is one sign doing the work of a whole English sentence.",
  },
  "doing-helping": {
    seoTitle: "ASL Everyday Verbs: Make, Give, Help, Want",
    intro:
      "The workhorse verbs: make, get, give, take, use, find, want, help. HELP is one of the first signs anyone should learn, and GIVE is a textbook directional verb. Many of these show up inside the ASL Phrases category too.",
  },
  colors: {
    seoTitle: "Colors in ASL: Red, Blue, Green, and More",
    intro:
      "Fourteen color signs on video. Several colors are the first letter of the English word shaken in front of you, which makes BLUE, GREEN, YELLOW, and PURPLE a matched set. RED touches the lips, BLACK crosses the forehead, WHITE pulls from the chest. Learn the patterns and the set is yours.",
    tip: "The shaken-letter colors look alike at speed. Keep the handshape crisp so B, G, Y, and P stay distinct.",
  },
  descriptions: {
    seoTitle: "ASL Adjectives: Big, Small, Fast, Slow, Beautiful",
    intro:
      "Describing words in ASL are often intensified by your face and the size of the movement rather than by adding VERY. BIG with wide eyes is bigger. Learn the base sign here, then practice scaling it up and down.",
    tip: "Make the sign match the meaning. SLOW signed slowly, FAST signed fast, SMALL signed small.",
  },
  home: {
    seoTitle: "ASL Signs for Home, House, Kitchen, Bathroom",
    intro:
      "Rooms and places at home. WHERE IS THE BATHROOM is in here because it is the most useful question in any building. HOUSE traces a roof and walls; HOME touches the cheek twice.",
  },
  furniture: {
    seoTitle: "ASL Furniture Signs: Table, Chair, Bed, Door",
    intro:
      "Table, chair, bed, couch, door, window, lamp, clock. Most of these are iconic and easy to picture: CHAIR is SIT done twice, BED is a head resting on a hand.",
  },
  hygiene: {
    seoTitle: "ASL Hygiene Signs: Shower, Toothbrush, Soap",
    intro:
      "Morning-routine vocabulary. Shower, toilet, sink, soap, toothbrush, brush, comb, mirror. Great for narrating your day to yourself as practice.",
  },
  chores: {
    seoTitle: "ASL Chore Signs: Clean, Wash, Cook, Sweep",
    intro:
      "Clean, wash, cook, sweep, vacuum, wash dishes. Household verbs you can practice while you actually do them, which is one of the best ways to make signs stick.",
  },
  mealtime: {
    seoTitle: "ASL Mealtime Signs: Hungry, Breakfast, Lunch, Dinner",
    intro:
      "Breakfast, lunch, and dinner all start with EAT, then add the time of day. HUNGRY and FULL are opposites on the chest. I'm hungry and I'm thirsty are in here as full phrases so you can say them without thinking.",
  },
  fruit: {
    seoTitle: "ASL Fruit Signs: Apple, Banana, Grapes, Strawberry",
    intro:
      "Apple, banana, grapes, strawberry, cherry, pineapple, lemon, orange. BANANA peels a finger, APPLE twists a knuckle on the cheek. Fruit signs are vivid and fun, which makes them easy to remember.",
  },
  vegetables: {
    seoTitle: "ASL Vegetable Signs: Tomato, Carrot, Corn, Potato",
    intro:
      "Tomato, carrot, corn, onion, potato, lettuce. CORN and CARROT both look like eating the vegetable; POTATO taps a fork into a fist.",
  },
  "protein-dairy": {
    seoTitle: "ASL Food Signs: Meat, Fish, Egg, Cheese, Milk",
    intro:
      "Meat, fish, egg, cheese, milk, butter, bacon, chicken. MILK is one of the first signs parents teach babies, and it is here on video. CHICKEN and BIRD share a beak at the mouth.",
  },
  "snacks-drinks": {
    seoTitle: "ASL Signs for Bread, Pizza, Coffee, Water",
    intro:
      "Bread, pizza, cake, chocolate, water, coffee, tea, juice. WATER is a W tapped on the chin, COFFEE grinds one fist on another. Pair these with I want to drink and you can order.",
  },
  weekdays: {
    seoTitle: "Days of the Week in ASL",
    intro:
      "Monday through Sunday are the first letter of the day, circled in front of you. Sunday is the exception with its own two-handed sign. Learn the pattern once and you have all seven.",
    tip: "Keep the circle small and the palm facing the person you are talking to.",
  },
  "time-of-day": {
    seoTitle: "ASL Time Signs: Morning, Afternoon, Today, Tomorrow",
    intro:
      "Time in ASL lives on a line that runs past your shoulder. Behind you is the past, in front is the future, and right at your body is now. Yesterday, today, and tomorrow all follow that line. Morning, afternoon, and night show the sun's position with your arm.",
    tip: "Put time first in the sentence. TOMORROW I GO, not I GO TOMORROW.",
  },
  "time-units": {
    seoTitle: "ASL Signs for Day, Week, Month, Year",
    intro:
      "Day, week, month, year, hour, minute, plus last week, next year, and a long time ago. WEEK slides a hand across your palm; add a direction and it becomes last week or next week. The timeline over your shoulder does the rest.",
  },
  "head-face": {
    seoTitle: "ASL Body Signs: Head, Face, Eyes, Nose, Mouth",
    intro:
      "Head, face, eyes, ear, nose, mouth, teeth, tongue. Most of these simply point to the part. Useful for the doctor, for describing someone, and for learning how ASL uses the face as part of grammar.",
  },
  body: {
    seoTitle: "ASL Body Part Signs: Arm, Hands, Shoulder, Back",
    intro:
      "Body, arm, hands, finger, shoulder, neck, back, stomach. Pair these with Symptoms to describe how you feel to a doctor or a friend.",
  },
  symptoms: {
    seoTitle: "ASL Signs for Sick, Hurt, Pain, Headache",
    intro:
      "Sick, hurt, pain, headache, cough, sneeze, tired, dizzy. HURT and PAIN are the same sign, and you move it to wherever it hurts. That is one sign doing the job of a whole list of English words.",
    tip: "Move HURT to the body part. HURT at the head is headache, at the stomach is stomachache.",
  },
  health: {
    seoTitle: "ASL Health Signs: Doctor, Nurse, Hospital, Medicine",
    intro:
      "Health, exercise, doctor, nurse, hospital, medicine, police. DOCTOR and NURSE both tap the wrist where a pulse is taken; the handshape tells them apart.",
  },
  personality: {
    seoTitle: "ASL Personality Signs: Confident, Lazy, Stubborn, Curious",
    intro:
      "Confident, humble, lazy, stubborn, curious, serious, plus remember and forget. Personality signs are a great place to practice matching your expression to the meaning.",
  },
  "big-feelings": {
    seoTitle: "ASL Signs for Bored, Lonely, Jealous, Surprised",
    intro:
      "The feelings beyond happy and sad. Bored, lonely, jealous, embarrassed, frustrated, surprised. Each of these has a face that goes with it, and the clip shows both.",
  },
  relationships: {
    seoTitle: "ASL Love and Friendship Signs: I Love You, Friend, Hug",
    intro:
      "Love, like, hate, friend, hug, kiss, and the phrases I like and I love you. The I-LOVE-YOU handshape is probably the most recognized sign in the world; here you will also learn the full sentence version.",
  },
  clothing: {
    seoTitle: "ASL Clothing Signs: Shirt, Pants, Shoes, Jacket",
    intro:
      "Shirt, pants, dress, shoes, socks, jacket, hat, clothes. Most clothing signs show where the item sits on your body or how you put it on.",
  },
  accessories: {
    seoTitle: "ASL Accessory Signs: Glasses, Ring, Watch, Backpack",
    intro:
      "Glasses, earring, necklace, bracelet, ring, backpack, wallet, watch. Nearly every one touches the spot where you wear it.",
  },
  transportation: {
    seoTitle: "ASL Transportation Signs: Car, Bus, Train, Airplane",
    intro:
      "Car, bus, train, airplane, bike, truck, motorcycle, boat. CAR steers a wheel, AIRPLANE flies the I-love-you handshape, BIKE pedals. Easy to picture, easy to keep.",
  },
  directions: {
    seoTitle: "ASL Direction Signs: Here, There, Left, Right, Up, Down",
    intro:
      "Here, there, left, right, up, down, near, far. Giving directions in ASL is mostly pointing with intent, and these signs give you the vocabulary around the pointing.",
  },
  places: {
    seoTitle: "ASL Place Signs: Store, Park, Restaurant, Library",
    intro:
      "Shop, park, restaurant, hotel, library, church, city, town, and more. Combine these with GO and WHERE and you can make plans.",
  },
  "brands-stores": {
    seoTitle: "ASL Signs for Brands and Stores",
    intro:
      "Amazon, Starbucks, McDonald's, Target, and other brand signs you will see in everyday Deaf conversation. Brand signs vary by region more than most; the clip shows one common version.",
  },
  commute: {
    seoTitle: "ASL Commute Signs: Drive, Ride, Travel, Traffic",
    intro:
      "Drive, ride, arrive, travel, road, street, traffic, commute. Useful for describing your day and for the question how do you get to work.",
  },
  school: {
    seoTitle: "ASL School Signs: Teacher, Student, Learn, Study",
    intro:
      "School, class, student, teacher, learn, study, read, write, and the school levels. TEACHER is TEACH plus the PERSON ending, a pattern you will see again in STUDENT, LAWYER, and more.",
  },
  work: {
    seoTitle: "ASL Work Signs: Job, Boss, Meeting, Engineer",
    intro:
      "Work, job, boss, lawyer, engineer, scientist, meeting, retire. WORK taps one fist on another; add the PERSON ending to many of these for a job title.",
  },
  "pets-farm": {
    seoTitle: "ASL Animal Signs: Dog, Cat, Horse, Cow",
    intro:
      "Dog, cat, horse, cow, pig, sheep, rabbit, duck. Animal signs are favorites with kids because almost all of them act out the animal's most recognizable feature.",
  },
  "wild-animals": {
    seoTitle: "ASL Wild Animal Signs: Lion, Elephant, Bear, Monkey",
    intro:
      "Lion, tiger, elephant, bear, wolf, fox, eagle, monkey. LION shows the mane, ELEPHANT the trunk, MONKEY scratches the sides. Fun to learn and fun to sign.",
  },
  "nature-seasons": {
    seoTitle: "ASL Nature Signs: Tree, Flower, Mountain, Ocean",
    intro:
      "Tree, flower, mountain, river, ocean, beach, sun, moon, and the seasons. TREE is a whole arm as a trunk with fingers as leaves, one of the most iconic signs in the language.",
  },
  weather: {
    seoTitle: "ASL Weather Signs: Rain, Snow, Wind, Hot, Cold",
    intro:
      "Rain, snow, wind, cloud, lightning, thunder, hot, cold. Weather signs come with weather faces: COLD with hunched shoulders, HOT with a grimace.",
  },
  sports: {
    seoTitle: "ASL Sports Signs: Football, Basketball, Soccer, Baseball",
    intro:
      "Football, basketball, baseball, soccer, volleyball, hockey, tennis, golf, and more. Most sports signs mime the sport's key motion, so they are quick to pick up.",
  },
  "arts-hobbies": {
    seoTitle: "ASL Hobby Signs: Draw, Paint, Sing, Dance, Music",
    intro:
      "Draw, paint, sing, dance, music, guitar, piano. Use these to answer what do you like to do, one of the first questions anyone will ask you.",
  },
  holidays: {
    seoTitle: "ASL Holiday Signs: Birthday, Christmas, Thanksgiving",
    intro:
      "Party, birthday, Christmas, Halloween, Thanksgiving, Easter, and the phrase happy birthday. Holiday signs vary by region; the clip shows one widely used version.",
  },
  countries: {
    seoTitle: "ASL Country Signs: America, Canada, Mexico, Japan",
    intro:
      "America, Canada, Mexico, France, Germany, China, Japan, Italy. Many country signs in ASL have been updated over the years to use the sign from that country's own sign language; the clips show current common forms.",
  },
  tech: {
    seoTitle: "ASL Tech Signs: Computer, Phone, Laptop, Camera",
    intro:
      "Computer, phone, tablet, laptop, camera, TV, keyboard, mouse. Tech vocabulary changes quickly in every language; these are the forms in common use now.",
  },
  "online-media": {
    seoTitle: "ASL Internet Signs: Email, Text, Video, Share",
    intro:
      "Internet, email, text, download, upload, share, send, video. Deaf communities were early adopters of video chat, and the vocabulary reflects it.",
  },
  "big-ideas": {
    seoTitle: "ASL Signs for Can, Cannot, Maybe, Important, Wrong",
    intro:
      "Can, cannot, maybe, important, right, wrong, future, always. Small signs with big grammatical weight. CAN and CANNOT are worth drilling until they are automatic.",
  },
  "asl-phrases": {
    seoTitle: "Common ASL Phrases on Video",
    intro:
      "Sixty-one complete phrases, each filmed as one smooth unit: my name is, nice to meet you, I don't understand, can you help me, where is the bathroom, I love you. Every phrase page lists the individual signs inside it, so you can learn the parts and the whole.",
    tip: "Sign phrases as one breath. The rhythm is part of what makes them read as fluent.",
  },
};

export function categoryCopy(id: string, fallbackTitle: string): CategoryCopy {
  return (
    CATEGORY_COPY[id] ?? {
      seoTitle: `ASL ${fallbackTitle} Signs`,
      intro: `Every ${fallbackTitle.toLowerCase()} sign in the Ziggy dictionary, filmed by a real signer. Tap any sign to watch it, slow it down, and learn how it is made.`,
    }
  );
}

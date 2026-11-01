/**
 * Circular unit scene icons from the iOS app (the stone preview sheet art),
 * exported by scripts/export-unit-scenes.mjs into public/art/unit-scenes.
 * 200px WebP with the white ring and soft shadow baked in. All 76 units are
 * exported; this map lists the ones the site places, so placements type-check.
 */
export const UNIT_SCENES = {
  "p1-u01": { title: "Welcome!", palette: "blue" },
  "p1-u02": { title: "Quick Replies", palette: "mint" },
  "p1-u05": { title: "Small Talk", palette: "pink" },
  "p1-u06": { title: "Feelings & Emotions", palette: "purple" },
  "p1-u10": { title: "The Alphabet", palette: "pink" },
  "p1-u15": { title: "Numbers", palette: "blue" },
  "p1-u18": { title: "Family & People", palette: "pink" },
  "p1-u22": { title: "Deaf Culture", palette: "orange" },
  "p1-u27": { title: "Colors", palette: "mint" },
  "p1-u60": { title: "Animals", palette: "mint" },
  "p1-u74": { title: "Then & Next", palette: "mint" },
  "p1-u81": { title: "Know & remember", palette: "blue" },
  "p1-prove-01": { title: "First Conversations Check-in", palette: "sky" },
} as const satisfies Record<string, { title: string; palette: string }>;

export type UnitSceneId = keyof typeof UNIT_SCENES;

export function sceneSrc(id: UnitSceneId): string {
  return `/art/unit-scenes/${id}.webp`;
}

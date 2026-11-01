// Exports the iOS app's circular unit scene icons to small WebP files for the web.
//
//   node scripts/export-unit-scenes.mjs [path/to/UnitSceneIcons]
//
// Reads every unitSceneIcon-{unitId}.imageset/*@2x.png (452px, ring and shadow
// baked in) and writes public/art/unit-scenes/{unitId}.webp at 200px.

import { mkdir, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const SIZE = 200;
const QUALITY = 82;
const DEFAULT_SRC = join(
  homedir(),
  "Desktop/Desktop - Max’s MacBook Pro (2)/ASL/ASL/Assets.xcassets/UnitSceneIcons",
);

const src = process.argv[2] ?? DEFAULT_SRC;
const out = join(process.cwd(), "public/art/unit-scenes");
await mkdir(out, { recursive: true });

const sets = (await readdir(src)).filter((d) => d.endsWith(".imageset"));
let count = 0;
for (const set of sets) {
  const unitId = set.replace(/^unitSceneIcon-/, "").replace(/\.imageset$/, "");
  const png = (await readdir(join(src, set))).find((f) => f.endsWith("@2x.png"));
  if (!png) {
    console.warn(`skip ${set}: no @2x.png`);
    continue;
  }
  await sharp(join(src, set, png))
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: QUALITY, alphaQuality: 90, effort: 6 })
    .toFile(join(out, `${unitId}.webp`));
  count++;
}
console.log(`exported ${count} icons to ${out}`);

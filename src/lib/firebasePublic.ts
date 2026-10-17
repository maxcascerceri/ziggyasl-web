/** Public Firebase web config. Override with Vercel env; these match the iOS app. */
export const firebasePublic = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyCsmGJkBUZhLt6-2LDkAQOyi7YMChLepiU",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "asl-app-718bf",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "asl-app-718bf.firebasestorage.app",
};

export const STORAGE_HOST = "firebasestorage.googleapis.com";

export function storageMediaURL(path: string, revision?: number): string {
  const encoded = encodeURIComponent(path);
  const v = revision ? `&v=${revision}` : "";
  return `https://${STORAGE_HOST}/v0/b/${firebasePublic.storageBucket}/o/${encoded}?alt=media${v}`;
}

/**
 * Web media is served with a one-year immutable cache header. When a sign is
 * re-filmed and its files are overwritten in place, bump its revision here so
 * browsers that cached the old clip fetch the new one.
 */
const MEDIA_REVISIONS: Record<string, number> = {
  bye: 2, // re-filmed 2026-10-17
  yourewelcome: 2, // re-filmed 2026-10-17
};

/** Web-optimized 540p H.264 clip uploaded by ASL/scripts/upload_web_videos.py. */
export function signVideoURL(wordId: string): string {
  return storageMediaURL(`asl-videos/${wordId}/web_540.mp4`, MEDIA_REVISIONS[wordId]);
}

/**
 * 960x540 web poster (~30 KB) uploaded by ASL/scripts/upload_web_posters.py.
 * (poster_001.jpg is the app's 4K first frame at ~350 KB; never ship that to the web.)
 */
export function signPosterURL(wordId: string): string {
  return storageMediaURL(`asl-videos/${wordId}/poster_960.jpg`, MEDIA_REVISIONS[wordId]);
}

/** 360px grid thumbnail (30–50 KB). */
export function signThumbURL(wordId: string): string {
  return storageMediaURL(`asl-videos/${wordId}/poster_thumb_360.jpg`, MEDIA_REVISIONS[wordId]);
}

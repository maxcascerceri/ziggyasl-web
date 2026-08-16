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

export function storageMediaURL(path: string): string {
  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${firebasePublic.storageBucket}/o/${encoded}?alt=media`;
}

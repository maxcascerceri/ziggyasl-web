export const APP_STORE_ID = "6781227577";

export type AppRating = { ratingValue: string; ratingCount: string };

/**
 * Ziggy's public App Store rating, read once per build from the iTunes lookup
 * API. Returns null on any failure so the rating is omitted rather than stale.
 */
export async function getAppStoreRating(): Promise<AppRating | null> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=us`, {
      cache: "force-cache",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { averageUserRating?: number; userRatingCount?: number }[];
    };
    const app = data.results?.[0];
    if (!app?.averageUserRating || !app.userRatingCount) return null;
    return {
      ratingValue: app.averageUserRating.toFixed(1),
      ratingCount: String(app.userRatingCount),
    };
  } catch {
    return null;
  }
}

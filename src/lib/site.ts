export const SITE_URL = "https://www.ziggyasl.com";
export const SITE_NAME = "Ziggy ASL";

/** GA4 web stream on the existing ASL Firebase Analytics property. */
export const GA_MEASUREMENT_ID = "G-FQVPGTSKLC";
export const AUTHOR = {
  name: "Ziggy Teaching Team",
  url: `${SITE_URL}/about`,
  description:
    "ASL lessons, guides, and the sign dictionary are written and reviewed by the Ziggy Teaching Team, with every clip filmed by our signers.",
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

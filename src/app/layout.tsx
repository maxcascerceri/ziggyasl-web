import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SearchProvider } from "@/components/SearchCommand";
import { JsonLd } from "@/components/ui";
import { APP_STORE_ID, getAppStoreRating, type AppRating } from "@/lib/appStoreRating";
import { links } from "@/lib/links";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

/** Same Nunito files the iOS app ships, so the web and the app match. */
const nunito = localFont({
  src: [
    { path: "./fonts/Nunito-Regular.ttf", weight: "400" },
    { path: "./fonts/Nunito-Medium.ttf", weight: "500" },
    { path: "./fonts/Nunito-SemiBold.ttf", weight: "600" },
    { path: "./fonts/Nunito-Bold.ttf", weight: "700" },
    { path: "./fonts/Nunito-ExtraBold.ttf", weight: "800" },
    { path: "./fonts/Nunito-Black.ttf", weight: "900" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ziggy — Learn ASL with real video",
    template: "%s | Ziggy ASL",
  },
  description:
    "Learn American Sign Language with a free video dictionary of 700+ signs, beginner guides reviewed with certified ASL interpreters, and the Ziggy app for daily practice.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  itunes: {
    appId: APP_STORE_ID,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FCFAF2",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/app-icon.png`,
  sameAs: [links.appStore, links.playStore],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@ziggyasl.com",
    contactType: "customer support",
  },
};

function appLd(rating: AppRating | null) {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Ziggy: Learn ASL Sign Language",
    operatingSystem: "iOS, Android",
    applicationCategory: "EducationalApplication",
    url: SITE_URL,
    downloadUrl: links.appStore,
    ...(rating ? { aggregateRating: { "@type": "AggregateRating", ...rating } } : {}),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rating = await getAppStoreRating();
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <GoogleAnalytics />
        <JsonLd data={[organizationLd, websiteLd, appLd(rating)]} />
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}

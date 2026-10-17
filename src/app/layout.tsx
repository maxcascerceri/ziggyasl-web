import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { SearchProvider } from "@/components/SearchCommand";
import { JsonLd } from "@/components/ui";
import { links } from "@/lib/links";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ziggy — Learn ASL with real video",
    template: "%s | Ziggy ASL",
  },
  description:
    "Learn American Sign Language with a free video dictionary of 700+ signs, beginner guides written by ASL teachers, and the Ziggy app for daily practice.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
  themeColor: "#F7F9FF",
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

const appLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ziggy: Learn ASL Sign Language",
  operatingSystem: "iOS, Android",
  applicationCategory: "EducationalApplication",
  url: SITE_URL,
  downloadUrl: links.appStore,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationLd, websiteLd, appLd]} />
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}

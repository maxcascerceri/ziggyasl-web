import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ziggyasl.com"),
  title: "Ziggy — Learn ASL",
  description:
    "Ziggy makes learning American Sign Language feel easy, friendly, and worth coming back to every day. Short video lessons, a clear path, and progress you can see.",
  openGraph: {
    title: "Ziggy — Learn ASL",
    description:
      "Short video lessons, a clear path, and a friendly guide. Learn ASL a few minutes a day.",
    siteName: "Ziggy",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F9FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

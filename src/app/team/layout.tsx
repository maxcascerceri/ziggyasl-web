import type { Metadata, Viewport } from "next";
import { TeamFrame } from "@/components/ops/TeamFrame";

export const metadata: Metadata = {
  title: "Ziggy team",
  robots: { index: false, follow: false },
  manifest: "/team/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Ziggy team",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F9FF",
  viewportFit: "cover",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeamFrame>{children}</TeamFrame>;
}

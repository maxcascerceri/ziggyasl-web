import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Ziggy ASL",
  description:
    "How Ziggy ASL handles local learning data, subscriptions, diagnostics, and optional sharing features.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LegalPage
        title={privacy.title}
        updated={privacy.updated}
        intro={privacy.intro}
        sections={privacy.sections}
      />
      <Footer />
    </>
  );
}

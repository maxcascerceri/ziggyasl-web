import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalPage } from "@/components/LegalPage";
import { terms } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use — Ziggy ASL",
  description:
    "Terms of Use for the Ziggy ASL app and website. Subscriptions, acceptable use, and contact.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <Header />
      <LegalPage
        title={terms.title}
        updated={terms.updated}
        intro={terms.intro}
        sections={terms.sections}
      />
      <Footer />
    </>
  );
}

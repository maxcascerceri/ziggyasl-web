import Link from "next/link";
import { links } from "@/lib/links";

type Section = { heading: string; body: string };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <main className="flex-1 px-5 pb-20 pt-36 sm:px-8 sm:pt-40">
      <article className="mx-auto max-w-2xl">
        <Link
          href={links.home}
          className="text-sm font-medium text-brand transition-colors hover:text-brand-shadow"
        >
          ← Ziggy ASL
        </Link>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-secondary">{updated}</p>

        <p className="mt-8 text-pretty text-base leading-relaxed text-ink/90">
          {intro}
        </p>

        {sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 text-pretty text-base leading-relaxed text-ink/90">
              {section.body}
            </p>
          </section>
        ))}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">
            {title === "Privacy Policy" ? "7. Contact" : "11. Contact"}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink/90">
            Questions? Email{" "}
            <a
              href={links.contact}
              className="font-semibold text-brand transition-colors hover:text-brand-shadow"
            >
              support@ziggyasl.com
            </a>
          </p>
        </section>

        <p className="mt-12">
          <Link
            href={links.home}
            className="text-sm font-medium text-brand transition-colors hover:text-brand-shadow"
          >
            ← Back to Ziggy ASL
          </Link>
        </p>
      </article>
    </main>
  );
}

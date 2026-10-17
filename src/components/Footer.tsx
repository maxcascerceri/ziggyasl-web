import Link from "next/link";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";
import { allCategories, START_HERE_CATEGORY_IDS, getCategory } from "@/lib/catalog";
import { LEARN_GUIDES } from "@/lib/learnGuides";

function Column({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.1em] text-ink">{title}</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) =>
          item.external ? (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-flex min-h-8 items-center text-sm font-medium text-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-8 items-center text-sm font-medium text-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export function Footer() {
  const startHere = START_HERE_CATEGORY_IDS.map((id) => getCategory(id)).filter(Boolean);
  const categoryCount = allCategories().length;

  return (
    <footer className="border-t border-divider bg-cream/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-bold text-ink">
            {copy.brand}
            <span className="text-brand">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">
            {copy.footer.note}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={links.appStore}
              className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white"
            >
              App Store
            </a>
            <a
              href={links.playStore}
              className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-ink outline outline-1 -outline-offset-1 outline-divider"
            >
              Google Play
            </a>
          </div>
        </div>
        <Column
          title="Dictionary"
          items={[
            ...startHere.map((c) => ({ label: c!.title, href: `/dictionary/${c!.slug}` })),
            { label: `All ${categoryCount} categories`, href: "/dictionary" },
          ]}
        />
        <Column
          title="Learn"
          items={[
            ...LEARN_GUIDES.slice(0, 7).map((g) => ({ label: g.shortTitle, href: `/learn/${g.slug}` })),
            { label: "All guides", href: "/learn" },
          ]}
        />
        <Column
          title="Ziggy"
          items={[
            { label: "Blog", href: "/blog" },
            { label: "About", href: "/about" },
            { label: copy.footer.privacy, href: links.privacyPath },
            { label: copy.footer.terms, href: links.termsPath },
            { label: copy.footer.contact, href: links.contact, external: true },
          ]}
        />
      </div>
      <div className="pb-8 text-center text-xs text-secondary">
        © {new Date().getFullYear()} Ziggy ASL · Made with love for ASL learners and the Deaf community.
      </div>
    </footer>
  );
}

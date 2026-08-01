import Link from "next/link";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";

export function Footer() {
  return (
    <footer className="border-t border-divider bg-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 sm:flex-row sm:justify-between sm:px-8">
        <div className="text-center sm:text-left">
          <p className="text-lg font-bold text-ink">
            {copy.brand}
            <span className="text-brand">.</span>
          </p>
          <p className="mt-1 text-sm text-secondary">{copy.footer.note}</p>
        </div>
        <nav className="flex items-center gap-2 text-sm font-medium text-secondary">
          <Link
            href={links.privacyPath}
            className="flex min-h-11 items-center px-2 transition-colors hover:text-ink"
          >
            {copy.footer.privacy}
          </Link>
          <Link
            href={links.termsPath}
            className="flex min-h-11 items-center px-2 transition-colors hover:text-ink"
          >
            {copy.footer.terms}
          </Link>
          <a
            href={links.contact}
            className="flex min-h-11 items-center px-2 transition-colors hover:text-ink"
          >
            {copy.footer.contact}
          </a>
        </nav>
      </div>
      <div className="pb-8 text-center text-xs text-secondary/70">
        © {new Date().getFullYear()} Ziggy ASL
      </div>
    </footer>
  );
}

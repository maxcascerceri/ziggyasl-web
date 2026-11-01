import Link from "next/link";
import { ArrowRight } from "./Icons";

/** Wide white link card: a title, one line of detail, and an arrow. */
export function LinkBanner({
  href,
  title,
  body,
  className = "",
}: {
  href: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`card-lift group flex items-center gap-4 rounded-[24px] bg-white p-4 outline outline-1 -outline-offset-1 outline-black/5 sm:gap-5 sm:p-5 ${className}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-extrabold leading-tight text-ink">{title}</span>
        <span className="mt-1 block text-sm text-secondary">{body}</span>
      </span>
      <ArrowRight size={20} className="shrink-0 text-brand-text transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

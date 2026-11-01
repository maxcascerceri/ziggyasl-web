import Link from "next/link";
import { ArrowRight } from "./Icons";
import { Sticker } from "./Sticker";

export const SIGN_YOUR_NAME_PATH = "/learn/how-to-sign-your-name";

/** Wide link card to the fingerspell-your-name tool. */
export function SignYourNameBanner({ className = "" }: { className?: string }) {
  return (
    <Link
      href={SIGN_YOUR_NAME_PATH}
      className={`card-lift group flex items-center gap-4 rounded-[24px] bg-white p-4 outline outline-1 -outline-offset-1 outline-black/5 sm:gap-5 sm:p-5 ${className}`}
    >
      <Sticker name="spell" size={64} />
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-extrabold leading-tight text-ink">
          How to sign your name in ASL
        </span>
        <span className="mt-1 block text-sm text-secondary">
          Type your name and watch it fingerspelled, letter by letter, on real video.
        </span>
      </span>
      <span className="cta-clay relative isolate hidden min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-brand px-5 text-sm font-extrabold text-white sm:inline-flex">
        Try it <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
      <ArrowRight size={20} className="shrink-0 text-brand-text sm:hidden" />
    </Link>
  );
}

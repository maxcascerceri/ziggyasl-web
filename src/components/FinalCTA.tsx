import { copy } from "@/lib/copy";
import { AppStoreButton } from "./AppStoreButton";
import { FadeIn } from "./Motion";

export function FinalCTA() {
  return (
    <section id="download" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <FadeIn>
        <div
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-b from-soft/70 to-soft/30 px-8 pb-16 pt-10 text-center sm:pb-20"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Celebrating Ziggy — the emotional payoff before the ask */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ziggy-celebrate.png"
            alt=""
            aria-hidden
            className="mx-auto mb-3 w-64 sm:w-80"
          />
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {copy.finalCta.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-secondary">
            {copy.finalCta.subline}
          </p>
          <div className="mt-9">
            <AppStoreButton label={copy.finalCta.cta} />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

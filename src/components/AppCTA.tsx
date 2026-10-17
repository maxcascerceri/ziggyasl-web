import { copy } from "@/lib/copy";
import Image from "next/image";
import { StoreButtons } from "./StoreButtons";

/**
 * In-content app conversion card. Used on sign pages, guides, and posts.
 * `context` personalizes the headline (e.g. the sign or category name).
 */
export function AppCTA({
  context,
  compact = false,
}: {
  context?: string;
  compact?: boolean;
}) {
  const headline = context
    ? `Practice “${context}” in Ziggy`
    : copy.appCta.headline;
  return (
    <aside
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-soft/70 via-cream to-pastel-mint/60 ${
        compact ? "px-6 py-6" : "px-7 py-8 sm:px-10 sm:py-10"
      }`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src="/brand/ziggy-celebrate.png"
          alt=""
          aria-hidden
          width={160}
          height={160}
          sizes={compact ? "96px" : "(max-width: 640px) 128px, 160px"}
          className={`${compact ? "w-24" : "w-32 sm:w-40"} h-auto shrink-0 drop-shadow-[0_10px_20px_rgba(41,46,56,0.18)]`}
        />
        <div className="flex-1">
          <p className="text-balance text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
            {headline}
          </p>
          <p className="mt-2 max-w-md text-pretty leading-relaxed text-secondary">
            {copy.appCta.body}
          </p>
          <div className="mt-5">
            <StoreButtons
              appStoreLabel={copy.appCta.appStoreCta}
              playStoreLabel={copy.appCta.playStoreCta}
              compact
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

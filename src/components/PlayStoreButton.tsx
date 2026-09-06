import { links } from "@/lib/links";

/**
 * Play Store twin of AppStoreButton — same clay CTA, Play glyph.
 * Listing: https://play.google.com/store/apps/details?id=com.ziggyasl.app
 */
export function PlayStoreButton({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <a
      href={links.playStore}
      target="_blank"
      rel="noopener noreferrer"
      className={`cta-clay relative isolate inline-flex select-none items-center justify-center gap-1.5 rounded-full bg-brand font-semibold text-white ${
        compact ? "px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base" : "px-5 py-3.5 text-base sm:px-6 sm:py-4 sm:text-lg"
      }`}
    >
      <PlayLogo className={compact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-5 w-5"} />
      {label}
    </a>
  );
}

function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M4.5 3.8v16.4c0 .9.96 1.44 1.73.97l14.1-8.2c.74-.43.74-1.51 0-1.94l-14.1-8.2A1.12 1.12 0 0 0 4.5 3.8z" />
    </svg>
  );
}

import { links } from "@/lib/links";

/**
 * Primary clay-blue CTA pill. Hover lift + shadow crossfade via an
 * ::after pseudo-element (opacity only — GPU friendly), press squish via
 * CSS transitions so it stays interruptible. Hover is gated to
 * hover-capable pointers in globals.css (.cta-clay rules).
 */
export function AppStoreButton({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <a
      href={links.appStore}
      target="_blank"
      rel="noopener noreferrer"
      className={`cta-clay relative isolate inline-flex select-none items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white ${
        compact ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
      }`}
    >
      <AppleLogo className={compact ? "h-5 w-5" : "h-5 w-5"} />
      {label}
    </a>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

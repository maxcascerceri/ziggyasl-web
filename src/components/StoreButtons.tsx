import { AppStoreButton } from "./AppStoreButton";
import { PlayStoreButton } from "./PlayStoreButton";

/**
 * App Store + Google Play side by side. Compact mode for header / tight rows.
 */
export function StoreButtons({
  appStoreLabel,
  playStoreLabel,
  compact = false,
  className = "",
}: {
  appStoreLabel: string;
  playStoreLabel: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start ${className}`}
    >
      <AppStoreButton label={appStoreLabel} compact={compact} />
      <PlayStoreButton label={playStoreLabel} compact={compact} />
    </div>
  );
}

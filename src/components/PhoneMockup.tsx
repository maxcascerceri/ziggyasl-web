"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CSS-drawn iPhone frame around a screenshot from /public/screenshots/.
 * Concentric radii: outer 52 = inner 42 + 10 bezel padding.
 * Shows a branded placeholder until the named PNG exists, so the layout
 * is fully editable before real screenshots are dropped in.
 */
export function PhoneMockup({
  screenshot,
  alt,
  priority = false,
  tilt = 0,
}: {
  /** File name inside public/screenshots/, e.g. "home.png". */
  screenshot: string;
  alt: string;
  priority?: boolean;
  tilt?: number;
}) {
  const [missing, setMissing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the 404 happened before hydration, onError never fires — detect it.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div
      className="relative mx-auto w-[min(300px,70vw)]"
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      {/* Device chrome */}
      <div
        className="relative aspect-[9/19.5] rounded-[52px] bg-ink p-[10px]"
        style={{ boxShadow: "var(--shadow-phone)" }}
      >
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-canvas outline outline-1 -outline-offset-1 outline-black/10">
          {missing ? (
            <div
              aria-hidden
              className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-soft via-canvas to-cream px-6 text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/ily-mark.png" alt="" className="w-16 opacity-90" />
              <span className="text-sm font-semibold text-secondary">
                Drop <code className="font-mono">{screenshot}</code> into{" "}
                <code className="font-mono">public/screenshots/</code>
              </span>
            </div>
          ) : (
            /* Plain img keeps missing files graceful via onError; swap to
               next/image once real screenshots are in place if desired. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={`/screenshots/${screenshot}`}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover"
              onError={() => setMissing(true)}
            />
          )}
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[14px] h-[24px] w-[86px] -translate-x-1/2 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

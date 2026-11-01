"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const PLAYED_KEY = "ziggy-wave-played";

/**
 * The waving Ziggy from the app's greetings video.
 *
 * Transparent WebM (VP9 alpha) keyed from the app's wave video, with the
 * white ILY hand and eye sparkles preserved. Safari falls back to the poster
 * still, since HEVC-with-alpha is unreliable in <video>.
 *
 * Plays once per browser session, then holds the last frame. Reduced motion
 * shows the poster still.
 */
export function ZiggyMoment({
  size = 320,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    try {
      if (sessionStorage.getItem(PLAYED_KEY)) return;
    } catch {
      /* private mode */
    }
    setCanPlay(true);
  }, [reduceMotion]);

  useEffect(() => {
    const video = ref.current;
    if (!canPlay || !video) return;
    const play = () => {
      video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("canplay", play, { once: true });
    return () => video.removeEventListener("canplay", play);
  }, [canPlay]);

  const markPlayed = () => {
    try {
      sessionStorage.setItem(PLAYED_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <span className={`inline-block ${className}`} style={{ width: size }}>
      {canPlay ? (
        <video
          ref={ref}
          muted
          playsInline
          preload="metadata"
          poster="/art/mascot/ziggy-wave-poster.webp"
          aria-hidden
          onEnded={markPlayed}
          className="h-auto w-full"
        >
          <source src="/art/mascot/ziggy-wave-alpha.webm" type="video/webm" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/art/mascot/ziggy-wave-poster.webp"
          alt=""
          width={size}
          height={size}
          fetchPriority={priority ? "high" : "auto"}
          className="h-auto w-full"
        />
      )}
    </span>
  );
}

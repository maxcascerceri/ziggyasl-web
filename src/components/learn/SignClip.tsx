"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { PlayIcon } from "../Icons";

export type ClipData = {
  id: string;
  slug: string;
  display: string;
  video: string;
  poster: string;
  aliases?: string[];
};

/**
 * Inline clip for guides. Plays (muted, looped) only while it is on screen,
 * so a page with 26 letters does not download 26 videos at once.
 */
export function SignClip({
  clip,
  caption,
  size = "md",
}: {
  clip: ClipData;
  caption?: string;
  size?: "sm" | "md" | "lg";
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // `playing` is kept in sync by the video's onPlaying / onPause events.
    if (visible && !reduceMotion) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [visible, reduceMotion]);

  const radius = size === "lg" ? "rounded-[28px]" : size === "sm" ? "rounded-2xl" : "rounded-[22px]";

  return (
    <figure className="m-0">
      <div className={`relative aspect-video overflow-hidden ${radius} bg-ink shadow-card outline outline-1 -outline-offset-1 outline-black/10`}>
        <video
          ref={ref}
          src={visible ? clip.video : undefined}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            if (el.paused) void el.play().catch(() => {});
            else {
              el.currentTime = 0;
              void el.play();
            }
          }}
          aria-label={`Video of the ASL sign for ${clip.display}`}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        />
        {!playing ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand shadow-card">
              <PlayIcon size={22} />
            </span>
          </span>
        ) : null}
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between gap-3">
        <Link
          href={`/sign/${clip.slug}`}
          className={`font-bold text-ink underline decoration-soft decoration-2 underline-offset-4 transition-colors hover:decoration-brand ${size === "sm" ? "text-sm" : "text-base"}`}
        >
          {clip.display}
          {clip.aliases?.length ? (
            <span className="font-medium text-secondary"> / {clip.aliases.join(" / ")}</span>
          ) : null}
        </Link>
        {caption ? <span className="text-xs text-secondary">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export function SignSequence({
  clips,
  columns = 3,
}: {
  clips: ClipData[];
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`my-8 grid gap-5 ${cols}`}>
      {clips.map((c) => (
        <SignClip key={c.id} clip={c} size={columns === 4 ? "sm" : "md"} />
      ))}
    </div>
  );
}

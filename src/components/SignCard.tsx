"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import type { SignCardData } from "@/lib/catalog";
import { signThumbURL, signVideoURL } from "@/lib/firebasePublic";

/**
 * Dictionary grid tile. Shows the poster thumb; on hover / focus the clip
 * plays inline and crossfades over the poster. Touch devices just link.
 */
export function SignCard({
  sign: input,
  categoryTitle,
  priority = false,
}: {
  sign: SignCardData;
  categoryTitle?: string;
  priority?: boolean;
}) {
  const sign = input;
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    if (reduceMotion) return;
    setArmed(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().then(() => setPlaying(true)).catch(() => {});
    }
  };
  const stop = () => {
    const v = videoRef.current;
    if (v) v.pause();
    setPlaying(false);
  };

  return (
    <Link
      href={`/sign/${sign.slug}`}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="card-lift group block overflow-hidden rounded-[22px] bg-white outline outline-1 -outline-offset-1 outline-black/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
        {/* Plain img: thumbs are pre-sized 360px JPEGs, so the optimizer only adds srcSet bytes. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signThumbURL(sign.id)}
          alt=""
          width={360}
          height={203}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {armed ? (
          <video
            ref={videoRef}
            src={signVideoURL(sign.id)}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
          />
        ) : null}
        {sign.type === "phrase" ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-shadow backdrop-blur">
            Phrase
          </span>
        ) : null}
      </div>
      <div className="px-3.5 py-3">
        <p className="truncate text-[15px] font-bold leading-tight text-ink">
          {sign.display}
        </p>
        <p className="mt-0.5 truncate text-xs font-medium text-secondary">
          {sign.aliases.length > 0
            ? `also ${sign.aliases.join(", ")}`
            : (categoryTitle ?? "ASL sign")}
        </p>
      </div>
    </Link>
  );
}

export function SignGrid({
  signs,
  categoryTitle,
  priorityCount = 0,
}: {
  signs: SignCardData[];
  categoryTitle?: string;
  priorityCount?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {signs.map((sign, i) => (
        <li key={sign.id}>
          <SignCard
            sign={sign}
            categoryTitle={categoryTitle}
            priority={i < priorityCount}
          />
        </li>
      ))}
    </ul>
  );
}

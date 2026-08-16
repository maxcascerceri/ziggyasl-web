"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { copy } from "@/lib/copy";

export function SignNotePlayer({
  src,
  poster,
  isImage,
  label,
}: {
  src: string;
  poster: string | null;
  isImage: boolean;
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (reduceMotion || isImage) return;
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      void video.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
      });
    };
    play();
  }, [reduceMotion, isImage, src]);

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    void video.play().then(() => setPlaying(true));
  }

  const frame =
    "relative mx-auto aspect-[9/16] w-full max-h-[min(72vh,520px)] overflow-hidden rounded-[28px] bg-black shadow-card outline outline-1 -outline-offset-1 outline-black/20";

  if (isImage) {
    return (
      <div className={frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const showPosterGate = Boolean(reduceMotion) && !playing;

  return (
    <div className={frame}>
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        muted
        loop={!reduceMotion}
        playsInline
        autoPlay={!reduceMotion}
        controls={false}
        className="h-full w-full object-contain"
        aria-label={label}
      />
      {showPosterGate ? (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-label={copy.note.play}
        >
          <span className="cta-clay relative isolate inline-flex min-h-11 items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white">
            {copy.note.play}
          </span>
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { pressSpring } from "@/lib/motion";
import { PauseIcon, PlayIcon, ReplayIcon, SlowIcon } from "./Icons";

/**
 * The hero sign player. Poster first, muted autoplay loop, playsInline.
 * Controls: pause/play, replay, half-speed. Tap the video to replay with a
 * soft shockwave. With Reduce Motion on, autoplay is off and a Play gate shows.
 */
export function SignVideo({
  src,
  poster,
  label,
  priority = false,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [ready, setReady] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = slow ? 0.5 : 1;
  }, [slow]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      // The SSR autoplay attribute may have started playback before hydration; honor the preference now.
      video.pause();
      return;
    }
    const tryPlay = () =>
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    tryPlay();
  }, [reduceMotion, src]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPlaying(true));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().then(() => setPlaying(true));
    setPulse((n) => n + 1);
  }, []);

  const controlCls =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink transition-colors hover:bg-cream focus-visible:bg-cream";

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="video-frame relative w-full overflow-hidden rounded-[28px] bg-ink shadow-phone outline outline-1 -outline-offset-1 outline-black/15 aspect-video">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={!reduceMotion}
          preload={priority ? "auto" : "metadata"}
          controls={false}
          onLoadedData={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={replay}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          aria-label={label}
        />

        {/* Replay shockwave */}
        <AnimatePresence>
          {pulse > 0 && !reduceMotion ? (
            <motion.span
              key={pulse}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/80"
              initial={{ opacity: 0.7, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            />
          ) : null}
        </AnimatePresence>

        {/* Reduce Motion / blocked autoplay gate */}
        {!playing ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play sign video"
            className="absolute inset-0 flex items-center justify-center bg-black/15"
          >
            <span className="cta-clay relative isolate inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand">
              <PlayIcon size={28} />
            </span>
          </button>
        ) : null}

        {/* Loading shimmer until first frame */}
        {!ready ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-b from-white/10 to-transparent"
          />
        ) : null}
      </div>

      <div
        role="group"
        aria-label="Video controls"
        className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card outline outline-1 -outline-offset-1 outline-divider"
      >
        <motion.button
          type="button"
          onClick={toggle}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          transition={pressSpring}
          aria-label={playing ? "Pause" : "Play"}
          className={controlCls}
        >
          {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </motion.button>
        <motion.button
          type="button"
          onClick={replay}
          whileTap={reduceMotion ? undefined : { scale: 0.92, rotate: -30 }}
          transition={pressSpring}
          aria-label="Replay"
          className={controlCls}
        >
          <ReplayIcon size={18} />
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setSlow((s) => !s)}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          transition={pressSpring}
          aria-pressed={slow}
          aria-label={slow ? "0.5× speed, click for normal speed" : "Slow: play at half speed"}
          className={`${controlCls} ${slow ? "bg-soft text-brand hover:bg-soft" : ""}`}
        >
          <SlowIcon size={18} />
          <span>{slow ? "0.5×" : "Slow"}</span>
        </motion.button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { pressSpring } from "@/lib/motion";
import { PauseIcon, PlayIcon, ReplayIcon, SlowIcon } from "../Icons";

export type LetterClip = {
  letter: string;
  slug: string;
  video: string;
  thumb: string;
};

/** Reads `?name=` so shared links open on that name. Render inside <Suspense>. */
export function NameSpellerFromUrl({ clips }: { clips: Record<string, LetterClip> }) {
  const fromUrl = useSearchParams().get("name")?.slice(0, 40);
  return <NameSpeller key={fromUrl ?? ""} clips={clips} initialName={fromUrl || DEFAULT_NAME} />;
}

type Tile = { key: string; clip: LetterClip; double: boolean } | { key: string; space: true };

const MAX_LETTERS = 24;
const DEFAULT_NAME = "Ziggy";
const LOOP_PAUSE_MS = 1100;

function toTiles(name: string, clips: Record<string, LetterClip>): Tile[] {
  const plain = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const tiles: Tile[] = [];
  let count = 0;
  let prev = "";
  for (const ch of plain) {
    if (count >= MAX_LETTERS) break;
    if (/[\s\-]/.test(ch)) {
      if (tiles.length && !("space" in tiles[tiles.length - 1])) {
        tiles.push({ key: `space-${tiles.length}`, space: true });
      }
      prev = "";
      continue;
    }
    const clip = clips[ch];
    if (!clip) continue;
    tiles.push({ key: `${ch}-${tiles.length}`, clip, double: ch === prev });
    prev = ch;
    count++;
  }
  if (tiles.length && "space" in tiles[tiles.length - 1]) tiles.pop();
  return tiles;
}

/**
 * Type a name, watch it fingerspelled. One <video> steps through the
 * letter clips; a hidden second one preloads the next letter so the
 * hand-off is seamless. With Reduce Motion nothing plays until asked.
 */
export function NameSpeller({
  clips,
  initialName = DEFAULT_NAME,
}: {
  clips: Record<string, LetterClip>;
  initialName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopTimer = useRef<number | null>(null);
  const [name, setName] = useState(initialName);
  const [index, setIndex] = useState(0);
  const [wantsPlay, setPlaying] = useState(true);
  const [userStarted, setUserStarted] = useState(false);
  const playing = wantsPlay && (!reduceMotion || userStarted);
  const [slow, setSlow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);

  const tiles = useMemo(() => toTiles(name, clips), [name, clips]);
  const sequence = useMemo(
    () => tiles.flatMap((t, i) => ("space" in t ? [] : [i])),
    [tiles],
  );
  const current = sequence.length ? tiles[sequence[Math.min(index, sequence.length - 1)]] : null;
  const currentClip = current && !("space" in current) ? current.clip : null;
  const nextTile = sequence.length ? tiles[sequence[(index + 1) % sequence.length]] : null;
  const nextClip = nextTile && !("space" in nextTile) ? nextTile.clip : null;
  const hasDouble = tiles.some((t) => !("space" in t) && t.double);

  const play = () => {
    setUserStarted(true);
    setPlaying(true);
  };

  const clearLoop = () => {
    if (loopTimer.current) window.clearTimeout(loopTimer.current);
    loopTimer.current = null;
  };

  useEffect(() => clearLoop, []);

  // `index` and `tick` are deps so a repeated letter (same clip, same src) still restarts.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = slow ? 0.5 : 1;
    video.playbackRate = slow ? 0.5 : 1;
    if (video.ended) video.currentTime = 0;
    if (playing) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }, [playing, slow, currentClip, index, tick]);

  const onNameChange = (value: string) => {
    clearLoop();
    setName(value);
    setIndex(0);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("name", value.trim());
    else url.searchParams.delete("name");
    window.history.replaceState(null, "", url);
  };

  const onEnded = () => {
    if (index < sequence.length - 1) {
      setIndex(index + 1);
      return;
    }
    clearLoop();
    loopTimer.current = window.setTimeout(() => {
      setIndex(0);
      setTick((t) => t + 1);
    }, LOOP_PAUSE_MS);
  };

  const restart = useCallback(() => {
    clearLoop();
    setIndex(0);
    const video = videoRef.current;
    if (video) video.currentTime = 0;
    setTick((t) => t + 1);
    setUserStarted(true);
    setPlaying(true);
  }, []);

  const jumpTo = (tileIndex: number) => {
    clearLoop();
    const pos = sequence.indexOf(tileIndex);
    if (pos < 0) return;
    setIndex(pos);
    const video = videoRef.current;
    if (video && pos === index) video.currentTime = 0;
    setTick((t) => t + 1);
    play();
  };

  const share = async () => {
    const url = new URL(window.location.href);
    if (name.trim()) url.searchParams.set("name", name.trim());
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; the URL bar already has the link */
    }
  };

  const controlCls =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink transition-colors hover:bg-cream focus-visible:bg-cream disabled:opacity-40";

  return (
    <div className="rounded-[32px] bg-white p-5 shadow-card outline outline-1 -outline-offset-1 outline-black/5 sm:p-8">
      <label htmlFor="name-speller" className="text-sm font-extrabold text-ink">
        Type your name
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="name-speller"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          maxLength={40}
          autoComplete="given-name"
          spellCheck={false}
          placeholder="Your name"
          className="min-h-14 w-full rounded-2xl bg-cream px-5 text-xl font-extrabold tracking-wide text-ink outline outline-1 -outline-offset-1 outline-divider placeholder:font-semibold placeholder:text-secondary/70 focus:outline-2 focus:outline-brand"
        />
        <button
          type="button"
          onClick={share}
          disabled={!tiles.length}
          className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-2xl bg-cream px-5 text-base font-extrabold text-ink outline outline-1 -outline-offset-1 outline-divider transition-colors hover:bg-soft disabled:opacity-40"
        >
          {copied ? "Link copied" : "Share my name"}
        </button>
      </div>

      {tiles.length ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="video-frame relative w-full overflow-hidden rounded-[24px] bg-ink outline outline-1 -outline-offset-1 outline-black/15 aspect-video">
              <video
                ref={videoRef}
                src={currentClip?.video}
                muted
                playsInline
                preload="auto"
                onEnded={onEnded}
                onPlay={() => setPlaying(true)}
                className="absolute inset-0 h-full w-full object-cover"
                aria-label={currentClip ? `Fingerspelling the letter ${currentClip.letter}` : undefined}
              />
              {currentClip ? (
                <span className="absolute left-3 top-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl font-extrabold text-ink shadow-card">
                  {currentClip.letter}
                </span>
              ) : null}
              {!playing ? (
                <button
                  type="button"
                  onClick={play}
                  aria-label="Play name"
                  className="absolute inset-0 flex items-center justify-center bg-black/15"
                >
                  <span className="cta-clay relative isolate inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand">
                    <PlayIcon size={28} />
                  </span>
                </button>
              ) : null}
            </div>
            {nextClip && nextClip.video !== currentClip?.video ? (
              <video src={nextClip.video} muted preload="auto" className="hidden" aria-hidden />
            ) : null}

            <div
              role="group"
              aria-label="Playback controls"
              className="flex items-center gap-1 rounded-full bg-white p-1 shadow-card outline outline-1 -outline-offset-1 outline-divider"
            >
              <motion.button
                type="button"
                onClick={() => (playing ? setPlaying(false) : play())}
                whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                transition={pressSpring}
                aria-label={playing ? "Pause" : "Play"}
                className={controlCls}
              >
                {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
              </motion.button>
              <motion.button
                type="button"
                onClick={restart}
                whileTap={reduceMotion ? undefined : { scale: 0.92, rotate: -30 }}
                transition={pressSpring}
                aria-label="Spell it again from the start"
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

          <div>
            <p className="text-sm font-extrabold text-ink">
              {sequence.length} {sequence.length === 1 ? "letter" : "letters"}. Tap one to replay it.
            </p>
            <ol className="mt-3 flex flex-wrap gap-2">
              {tiles.map((t, i) =>
                "space" in t ? (
                  <li key={t.key} aria-hidden className="w-3" />
                ) : (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Play letter ${t.clip.letter}`}
                      aria-current={current === t ? "step" : undefined}
                      className={`group relative flex w-[68px] flex-col items-center overflow-hidden rounded-2xl bg-cream pb-1.5 outline outline-2 -outline-offset-2 transition-[outline-color,transform] duration-150 ${
                        current === t ? "outline-brand" : "outline-transparent hover:outline-divider"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.clip.thumb}
                        alt=""
                        width={68}
                        height={44}
                        loading="lazy"
                        decoding="async"
                        className="h-11 w-full object-cover"
                      />
                      <span className="mt-1 text-lg font-extrabold leading-none text-ink">{t.clip.letter}</span>
                      {t.double ? (
                        <span className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-[10px] font-extrabold text-brand-text">
                          slide
                        </span>
                      ) : null}
                    </button>
                  </li>
                ),
              )}
            </ol>

            <ul className="mt-6 space-y-2 text-sm leading-relaxed text-secondary">
              <li>
                <span className="font-extrabold text-ink">Hold one hand at your shoulder,</span> palm
                facing out, and keep it there for every letter.
              </li>
              {hasDouble ? (
                <li>
                  <span className="font-extrabold text-ink">Double letter?</span> Sign it once, then
                  slide your hand slightly to the side for the second one.
                </li>
              ) : null}
              <li>
                <span className="font-extrabold text-ink">Keep a steady rhythm.</span> No bouncing on
                each letter; let the shapes flow into each other.
              </li>
            </ul>

            {currentClip ? (
              <Link
                href={`/sign/${currentClip.slug}`}
                className="mt-5 inline-flex text-sm font-extrabold text-brand-text underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
              >
                How to make the letter {currentClip.letter}
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-cream p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/stickers/redrill-review-thinking.webp" alt="" width={72} height={72} className="h-auto w-[72px]" />
          <p className="text-secondary">
            Type a name using the letters A to Z and Ziggy will fingerspell it for you.
          </p>
        </div>
      )}
    </div>
  );
}

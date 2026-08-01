"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { copy } from "@/lib/copy";
import { easeOut } from "@/lib/motion";
import { AppStoreButton } from "./AppStoreButton";
import { PhoneMockup } from "./PhoneMockup";
import { RiseIn } from "./Motion";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);

  // Decorative spring-based mouse tilt (±4°) — mouse pointers only,
  // fully disabled under Reduce Motion.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 120, damping: 14 });
  const springTiltY = useSpring(tiltY, { stiffness: 120, damping: 14 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse" || !visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(relY * -8);
    tiltY.set(relX * 8);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-44 pb-20 sm:pt-52 sm:pb-28">
      {/* Soft periwinkle wash behind the phone */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, var(--soft) 0%, rgba(204,227,252,0.35) 45%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <RiseIn>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {copy.hero.headline}
            </h1>
          </RiseIn>
          <RiseIn delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-secondary lg:mx-0">
              {copy.hero.subline}
            </p>
          </RiseIn>
          <RiseIn delay={0.16}>
            <div className="mt-9">
              <AppStoreButton label={copy.hero.cta} />
            </div>
          </RiseIn>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
        >
          <div
            ref={visualRef}
            className="relative"
            style={{ perspective: 900 }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
          >
            <motion.div
              style={
                reduceMotion
                  ? undefined
                  : { rotateX: springTiltX, rotateY: springTiltY }
              }
            >
              <PhoneMockup
                screenshot={copy.hero.screenshot}
                alt={copy.hero.screenshotAlt}
                priority
              />
            </motion.div>
            {/* Ziggy peeking in beside the phone — decorative, captioned by the headline */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/ziggy-sign.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-12 -left-2 w-52 drop-shadow-[0_10px_20px_rgba(41,46,56,0.18)] sm:-left-32 sm:w-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

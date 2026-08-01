"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { stagger } from "@/lib/motion";
import { PhoneMockup } from "./PhoneMockup";
import { FadeIn } from "./Motion";

/**
 * Alternating copy + phone block. The phone gets a gentle scroll parallax;
 * with Reduce Motion the parallax is off and only the fade entrance remains.
 * `mascot` optionally tucks a small Ziggy cutout next to the phone.
 */
export function FeatureSection({
  title,
  body,
  screenshot,
  screenshotAlt,
  reversed = false,
  mascot,
}: {
  title: string;
  body: string;
  screenshot: string;
  screenshotAlt: string;
  reversed?: boolean;
  mascot?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [32, -32]);

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20"
    >
      <FadeIn className={reversed ? "lg:order-2" : ""}>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-secondary">
          {body}
        </p>
      </FadeIn>

      <FadeIn delay={stagger} className={reversed ? "lg:order-1" : ""}>
        <motion.div
          className="relative"
          style={reduceMotion ? undefined : { y: parallaxY }}
        >
          <PhoneMockup
            screenshot={screenshot}
            alt={screenshotAlt}
            tilt={reversed ? -2 : 2}
          />
          {mascot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mascot}
              alt=""
              aria-hidden
              className={`pointer-events-none absolute -bottom-10 w-52 drop-shadow-[0_10px_20px_rgba(41,46,56,0.18)] sm:w-72 ${
                reversed ? "-left-14 sm:-left-24" : "-right-14 sm:-right-24"
              }`}
            />
          ) : null}
        </motion.div>
      </FadeIn>
    </div>
  );
}

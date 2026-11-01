"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { sceneSrc, type UnitSceneId } from "@/content/unitScenes";

export type DriftScene = {
  scene: UnitSceneId;
  /** Vertical position inside the parent, e.g. "18%". */
  top: string;
  side: "left" | "right";
  /** Distance from that side. Defaults to the center of the page gutter beside a max-w-6xl container. */
  inset?: string;
  /** Rendered size in px. The disc fills ~83% of it; the rest is the baked-in shadow. */
  size?: number;
  rotate?: number;
  /** Scroll travel multiplier. Larger drifts further; negative drifts the other way. */
  depth?: number;
  /** Smallest breakpoint the icon shows at. Gutters only exist from xl up. */
  from?: "lg" | "xl";
};

const SHOW = { lg: "hidden lg:block", xl: "hidden xl:block" } as const;

/**
 * Sparse unit scene circles from the app floating in the page margins. Fill
 * the parent (which must be `relative`); each drifts a little slower or
 * faster than the scroll so they read as depth. Static with Reduce Motion,
 * hidden on small screens, invisible to assistive tech.
 */
export function SceneDrift({ items }: { items: DriftScene[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-x-clip">
      {items.map((item) => (
        <DriftItem
          key={`${item.scene}-${item.top}-${item.side}`}
          item={item}
          progress={scrollYProgress}
          still={Boolean(reduceMotion)}
        />
      ))}
    </div>
  );
}

function DriftItem({
  item,
  progress,
  still,
}: {
  item: DriftScene;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const { scene, top, side, size = 84, rotate = 0, depth = 1, from = "xl" } = item;
  const travel = 90 * depth;
  const y = useTransform(progress, [0, 1], [travel, -travel]);
  const r = useTransform(progress, [0, 1], [rotate - 4 * depth, rotate + 4 * depth]);
  const inset = item.inset ?? `max(8px, calc((100% - 72rem) / 4 - ${size / 2}px))`;

  return (
    <motion.img
      src={sceneSrc(scene)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`absolute h-auto ${SHOW[from]}`}
      style={{
        top,
        [side]: inset,
        width: size,
        ...(still ? { rotate } : { y, rotate: r }),
      }}
    />
  );
}

// Single source of truth for motion values — durations, easings, springs.
// Cubic beziers follow the "strong ease-out / ease-in-out" curves from
// design-engineering practice; springs stay critically-damped by default.

/** Strong ease-out — entrances, reveals, anything arriving on screen. */
export const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Strong ease-in-out — on-screen movement and morphs. */
export const easeInOut: [number, number, number, number] = [0.77, 0, 0.175, 1];

export const durations = {
  /** Button/press feedback. */
  press: 0.16,
  /** Scroll reveals and hero entrances. */
  reveal: 0.5,
} as const;

/** Critically-damped spring for state changes (header morph, mouse tilt). */
export const uiSpring = {
  type: "spring",
  stiffness: 260,
  damping: 30,
} as const;

/** Snappier spring for small press feedback. */
export const pressSpring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
} as const;

/** Scroll-reveal stagger between sibling elements, in seconds. */
export const stagger = 0.07;

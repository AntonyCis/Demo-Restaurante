/**
 * Sabor Quiteño — settings
 *
 * Every tunable in one place. Behaviour modules read from here instead of
 * hard-coding numbers, so tuning never requires touching logic (Open/Closed).
 */
export const SETTINGS = Object.freeze({
  header: {
    /** px scrolled before the bar switches to its solid theme */
    scrollThreshold: 24,
  },

  mobileNav: {
    /** matches Tailwind's `lg` breakpoint */
    desktopBreakpoint: 1024,
  },

  preloader: {
    /** fake progress tick interval */
    tickMs: 80,
    maxProgressPerTick: 14,
    minProgressPerTick: 6,
    /** hard ceiling so a stalled asset load can never trap the user */
    maxWaitMs: 2600,
  },

  lenis: {
    duration: 1.25,
    anchorDuration: 1.2,
    /** header height in px, subtracted when jumping to an anchor */
    anchorOffset: -80,
  },

  reveal: {
    /** ScrollTrigger `start` for image reveals */
    start: "top 85%",
    headingStart: "top 88%",
  },

  cursor: {
    lerp: 0.12,
    dotLerp: 0.28,
    hoverScale: 1.7,
  },

  reservation: {
    whatsappNumber: "593999123456",
  },
});

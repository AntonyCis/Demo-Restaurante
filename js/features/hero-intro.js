import { NOOP_FEATURE } from "../core/dom.js";

/**
 * Sabor Quiteño — hero entrance
 *
 * Fires once, after the preloader clears. Kept separate from the scroll reveals
 * because its timing depends on the intro rather than on scroll position.
 * Selectors are handed to the motion port unresolved so it can match every
 * `.line` in the title.
 */
export function createHeroIntro({ motion, selectors = {} }) {
  const { title = "#hero-title .line", subtitle = "#hero-sub", actions = "#hero-cta" } = selectors;
  if (!motion.available) return NOOP_FEATURE;

  return {
    play() {
      const timeline = motion.timeline({ defaults: { ease: "power3.out" } });

      timeline.from(title, { yPercent: 105, duration: 1.1, stagger: 0.09, ease: "power4.out" }, 0.2);
      timeline.from(subtitle, { y: 16, opacity: 0, duration: 0.8 }, 0.7);
      timeline.from(actions, { y: 12, opacity: 0, duration: 0.6 }, 0.85);
    },
    destroy() {},
  };
}

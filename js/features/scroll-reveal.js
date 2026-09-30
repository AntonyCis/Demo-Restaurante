import { NOOP_FEATURE } from "../core/dom.js";

/**
 * Sabor Quiteño — scroll-driven reveals
 *
 * Three independent effects, each with its own trigger range. Grouped here
 * because they share one ScrollTrigger lifecycle and one registration pass.
 */
export function createScrollReveal({ motion, settings }) {
  if (!motion.available) return NOOP_FEATURE;

  motion.register();

  motion.onEnter(".img-reveal", {
    start: settings.reveal.start,
    onEnter: (element) => element.classList.add("in"),
  });

  motion.onEnter("h2", {
    start: settings.reveal.headingStart,
    onEnter: (element) => motion.from(element, { y: 18, opacity: 0, duration: 0.8 }),
  });

  motion.scrub("#hero-img", {
    trigger: "#hero-img-wrap",
    start: "top top",
    end: "bottom top",
    from: { yPercent: 7 },
    ease: "none",
  });

  return { destroy() {} };
}

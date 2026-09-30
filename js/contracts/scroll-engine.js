/**
 * Sabor Quiteño — scroll engine contract
 *
 * Consumers receive a ScrollEngine by injection and never touch `window.scrollY`
 * or Lenis directly, so either implementation can be swapped without editing a
 * feature (Dependency Inversion, Liskov Substitution).
 *
 * @typedef {object} ScrollEngine
 * @property {number} y current scroll offset in px
 * @property {(callback: (y: number) => void) => () => void} onScroll subscribes, returns unsubscribe
 * @property {(target: Element|string, options?: { offset?: number, duration?: number, instant?: boolean }) => void} scrollTo
 * @property {() => void} destroy
 *
 * @typedef {object} Ticker
 * @property {(frame: (time: number) => void) => () => void} add runs on the shared clock, returns remove
 */

import { createNativeScrollEngine } from "../infrastructure/native-scroll-engine.js";
import { createLenisScrollEngine } from "../infrastructure/lenis-scroll-engine.js";
import { createTicker } from "../infrastructure/ticker.js";

/**
 * Smooth scrolling requires both the Lenis bundle and a user who has not asked
 * for reduced motion; otherwise the engine degrades to native scrolling.
 */
export function createScrollEngine({ window: win, document: doc, settings, motion }) {
  const ticker = createTicker({ window: win, motion });

  if (!motion.reduced && win.Lenis) {
    return createLenisScrollEngine({ window: win, document: doc, settings, ticker });
  }
  return createNativeScrollEngine({ window: win, document: doc });
}

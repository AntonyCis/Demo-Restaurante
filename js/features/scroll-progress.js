import { NOOP_FEATURE } from "../core/dom.js";

/**
 * Sabor Quiteño — reading progress bar
 *
 * Driven by the scroll offset supplied by the engine, so it tracks the
 * interpolated position under smooth scrolling instead of the raw native value.
 */
export function createScrollProgress({ element, window: win, document: doc }) {
  if (!element) return NOOP_FEATURE;

  return {
    update(y) {
      const scrollable = doc.documentElement.scrollHeight - win.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
      element.style.transform = `scaleX(${ratio})`;
    },
    destroy() {},
  };
}

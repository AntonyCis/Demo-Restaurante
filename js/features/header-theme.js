import { NOOP_FEATURE, toggleClass } from "../core/dom.js";

/**
 * Sabor Quiteño — header theme
 *
 * Owns nothing but the bar's light/dark state. Layout and colour live in
 * css/components/header.css, so adding a header child never means editing JS.
 */
export function createHeaderTheme({ element, threshold = 24 }) {
  if (!element) return NOOP_FEATURE;

  let state = null;

  const apply = (isScrolled) => {
    if (isScrolled === state) return;
    state = isScrolled;

    toggleClass(element, "is-scrolled", isScrolled);
    toggleClass(element, "bg-cream", isScrolled);
    toggleClass(element, "backdrop-blur-[10px]", isScrolled);
    toggleClass(element, "border-line", isScrolled);
    toggleClass(element, "shadow-sm", isScrolled);
    toggleClass(element, "bg-transparent", !isScrolled);
    toggleClass(element, "backdrop-blur-0", !isScrolled);
    toggleClass(element, "border-white/15", !isScrolled);
  };

  return {
    update: (y) => apply(y > threshold),
    get isScrolled() {
      return state === true;
    },
    destroy() {
      state = null;
    },
  };
}

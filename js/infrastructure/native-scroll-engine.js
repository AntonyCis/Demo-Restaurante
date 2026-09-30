/**
 * Sabor Quiteño — native scroll engine (no third-party dependencies)
 */
export function createNativeScrollEngine({ window: win, document: doc }) {
  /** @type {Set<(y: number) => void>} */
  const listeners = new Set();
  let detach = () => {};

  const emit = () => {
    const y = win.scrollY;
    for (const listener of listeners) listener(y);
  };

  const resolveTop = (target, offset) => {
    const element = typeof target === "string" ? doc.querySelector(target) : target;
    if (!element) return 0;
    return element.getBoundingClientRect().top + win.scrollY + (offset ?? 0);
  };

  return {
    get y() {
      return win.scrollY;
    },
    onScroll(callback) {
      listeners.add(callback);
      if (listeners.size === 1) {
        win.addEventListener("scroll", emit, { passive: true });
        detach = () => win.removeEventListener("scroll", emit);
      }
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) detach();
      };
    },
    scrollTo(target, { offset = 0, instant = false } = {}) {
      win.scrollTo({ top: resolveTop(target, offset), behavior: instant ? "auto" : "smooth" });
    },
    destroy() {
      detach();
      listeners.clear();
    },
  };
}

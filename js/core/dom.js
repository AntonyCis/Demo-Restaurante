/**
 * Sabor Quiteño — DOM primitives
 *
 * Deliberately tiny and independent (Interface Segregation): each helper does
 * one thing and can be replaced without touching its consumers. All of them are
 * null-safe so feature modules can boot without defensive checks of their own.
 */

/** @type {(selector: string, root?: ParentNode) => Element | null} */
export const qs = (selector, root = document) => root.querySelector(selector);

/** @type {(selector: string, root?: ParentNode) => Element[]} */
export const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/**
 * Adds a listener and returns its disposer.
 * @returns {() => void}
 */
export function on(target, type, handler, options) {
  if (!target) return () => {};
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/** Toggles a class only when the element exists. */
export function toggleClass(element, className, force) {
  if (element) element.classList.toggle(className, force);
}

/** A feature that failed to find its elements and therefore does nothing. */
export const NOOP_FEATURE = Object.freeze({
  update() {},
  destroy() {},
  setOpen() {},
  get isOpen() {
    return false;
  },
  get isScrolled() {
    return false;
  },
});

/**
 * Runs every disposer in a list, ignoring failures, so teardown is total.
 * @param {Array<() => void>} disposers
 */
export function disposeAll(disposers) {
  for (const dispose of disposers) {
    try {
      dispose?.();
    } catch {
      /* teardown must never throw */
    }
  }
}

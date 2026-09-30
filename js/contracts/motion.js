/**
 * Motion port.
 *
 * Features depend on this shape only, never on `window.gsap`, so the animation
 * library can be swapped, stubbed or unavailable without touching a feature.
 * Every method is a no-op when GSAP is missing or the user prefers reduced
 * motion, which lets callers keep their final-state markup intact.
 *
 * @typedef {object} Motion
 * @property {boolean} reduced
 * @property {boolean} available
 * @property {() => void} register idempotent plugin registration
 * @property {(targets: Element|string, vars: object) => void} to
 * @property {(targets: Element|string, vars: object) => void} from
 * @property {(targets: Element|string, vars: object) => object} timeline
 * @property {(targets: Element|string, options: object) => void} onEnter
 * @property {(targets: Element|string, options: object) => void} revealOnScroll
 * @property {(targets: Element|string, options: object) => void} scrub
 */

import { NOOP_FEATURE, on, qsa } from "../core/dom.js";

/**
 * Sabor Quiteño — custom cursor
 *
 * Pointer-precision devices only. A single rAF loop lerps the ring and the dot
 * separately, which is what gives them their slight lag apart.
 */
export function createCursor({ ring, dot, settings, motion, window: win, document: doc }) {
  const supported =
    !motion.reduced && win.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!supported || !ring || !dot) return NOOP_FEATURE;

  const { lerp, dotLerp } = settings.cursor;
  const ringOffset = ring.offsetWidth / 2;
  const dotOffset = dot.offsetWidth / 2;

  let targetX = win.innerWidth / 2;
  let targetY = win.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let dotX = targetX;
  let dotY = targetY;
  let frame = null;

  const render = () => {
    ringX += (targetX - ringX) * lerp;
    ringY += (targetY - ringY) * lerp;
    dotX += (targetX - dotX) * dotLerp;
    dotY += (targetY - dotY) * dotLerp;
    ring.style.transform = `translate(${ringX - ringOffset}px, ${ringY - ringOffset}px)`;
    dot.style.transform = `translate(${dotX - dotOffset}px, ${dotY - dotOffset}px)`;
    frame = win.requestAnimationFrame(render);
  };

  const disposers = [
    on(win, "mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    }),
    ...qsa("a,button", doc).map((element) => on(element, "mouseenter", () => ring.classList.add("hover"))),
    ...qsa("a,button", doc).map((element) => on(element, "mouseleave", () => ring.classList.remove("hover"))),
  ];

  frame = win.requestAnimationFrame(render);

  return {
    destroy() {
      if (frame) win.cancelAnimationFrame(frame);
      disposers.forEach((dispose) => dispose());
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    },
  };
}

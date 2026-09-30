/**
 * Sabor Quiteño — shared animation clock
 *
 * Prefers GSAP's ticker so Lenis and ScrollTrigger advance on one clock;
 * falls back to requestAnimationFrame when GSAP is absent.
 */
export function createTicker({ window: win, motion }) {
  if (motion.available) {
    return {
      add: (frame) => {
        motion.register();
        win.gsap.ticker.add(frame);
        win.gsap.ticker.lagSmoothing(0);
        return () => win.gsap.ticker.remove(frame);
      },
    };
  }

  return {
    add: (frame) => {
      const loop = (time) => {
        frame(time);
        win.requestAnimationFrame(loop);
      };
      const id = win.requestAnimationFrame(loop);
      return () => win.cancelAnimationFrame(id);
    },
  };
}

/**
 * Sabor Quiteño — Lenis scroll engine
 *
 * Same contract as the native engine, so consumers cannot tell them apart.
 * Keeping ScrollTrigger in step with the interpolated position is the whole
 * point of this adapter: native scroll events alone fire too rarely for scrub.
 */
export function createLenisScrollEngine({ window: win, document: doc, settings, ticker }) {
  const instance = new win.Lenis({
    duration: settings.lenis.duration,
    easing: (t) => Math.min(1, 1.001 - 2 ** -10 * t),
    smoothWheel: true,
    smoothTouch: false,
  });

  doc.documentElement.classList.add("lenis", "lenis-smooth");
  instance.on("scroll", () => win.ScrollTrigger?.update());
  const stopTicking = ticker.add((time) => instance.raf(time * 1000));

  return {
    get y() {
      return instance.scroll ?? win.scrollY;
    },
    onScroll(callback) {
      const handler = ({ scroll }) => callback(scroll);
      instance.on("scroll", handler);
      return () => instance.off("scroll", handler);
    },
    scrollTo(target, options) {
      instance.scrollTo(target, options);
    },
    destroy() {
      stopTicking();
      instance.destroy();
      doc.documentElement.classList.remove("lenis", "lenis-smooth");
    },
  };
}

import { NOOP_FEATURE, on, qsa } from "../core/dom.js";

/**
 * Sabor Quiteño — in-page anchor navigation
 *
 * Routes every same-page link through the injected scroll engine so anchors
 * respect the header height and whatever scrolling strategy is active. Links
 * without a real target are left to the browser.
 */
export function createAnchorNavigation({ engine, document: doc, settings }) {
  const anchors = qsa('a[href^="#"]', doc).filter((link) => {
    const href = link.getAttribute("href");
    return href && href.length > 1 && Boolean(doc.querySelector(href));
  });

  if (!anchors.length) return NOOP_FEATURE;

  const disposers = anchors.map((link) =>
    on(link, "click", (event) => {
      const target = doc.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      engine.scrollTo(target, { offset: settings.lenis.anchorOffset, duration: settings.lenis.anchorDuration });
    }),
  );

  return {
    destroy() {
      disposers.forEach((dispose) => dispose());
    },
  };
}

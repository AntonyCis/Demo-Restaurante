/**
 * Sabor Quiteño — composition root
 *
 * The only module that knows the whole system. Its single responsibility is to
 * build the dependency graph and hand each feature what it needs; every decision
 * about how things behave lives in the feature itself.
 *
 * Adding a feature = one import + one line here.
 */
import { SETTINGS } from "./config/settings.js";
import { disposeAll, qs } from "./core/dom.js";
import { createMotion } from "./infrastructure/gsap-motion.js";
import { createScrollEngine } from "./contracts/scroll-engine.js";

import { createHeaderTheme } from "./features/header-theme.js";
import { createMobileNavigation } from "./features/mobile-navigation.js";
import { createPreloader } from "./features/preloader.js";
import { createCursor } from "./features/cursor.js";
import { createHeroIntro } from "./features/hero-intro.js";
import { createScrollReveal } from "./features/scroll-reveal.js";
import { createAnchorNavigation } from "./features/anchor-navigation.js";
import { createScrollProgress } from "./features/scroll-progress.js";
import { createReservationForm } from "./features/reservation-form.js";

function bootstrap(env) {
  const { window: win, document: doc } = env;

  const motion = createMotion({ window: win });
  const engine = createScrollEngine({ window: win, document: doc, settings: SETTINGS, motion });

  // --- scroll-reactive features -------------------------------------------
  const header = createHeaderTheme({
    element: qs("#header"),
    threshold: SETTINGS.header.scrollThreshold,
  });
  const progress = createScrollProgress({
    element: qs("#progress"),
    window: win,
    document: doc,
  });

  const stopScrollSync = engine.onScroll((y) => {
    header.update(y);
    progress.update(y);
  });

  // --- navigation ----------------------------------------------------------
  const anchors = createAnchorNavigation({
    engine,
    document: doc,
    settings: SETTINGS,
  });

  const mobileNav = createMobileNavigation({
    button: qs("#menuBtn"),
    panel: qs("#mobileNav"),
    window: win,
    document: doc,
    body: doc.body,
    desktopBreakpoint: SETTINGS.mobileNav.desktopBreakpoint,
  });

  // --- animated entrance ---------------------------------------------------
  const heroIntro = createHeroIntro({ motion });

  // The reveal triggers must exist before the hero intro starts, otherwise
  // ScrollTrigger measures a page that has not finished laying out.
  const reveals = motion.reduced ? { destroy() {} } : createScrollReveal({ motion, settings: SETTINGS });

  const preloader = createPreloader({
    element: qs("#preloader"),
    bar: qs("#preloader-bar"),
    percent: qs("#preloader-pct"),
    line: qs("#preloader-line"),
    settings: SETTINGS,
    motion,
    window: win,
    onDismiss: () => heroIntro.play(),
  });

  // --- independent features ------------------------------------------------
  const cursor = createCursor({
    ring: qs("#cursor"),
    dot: qs("#cursor-dot"),
    settings: SETTINGS,
    motion,
    window: win,
    document: doc,
  });

  const reservation = createReservationForm({
    form: qs("#reservaForm"),
    window: win,
    settings: SETTINGS,
  });
  const unbindReservation = reservation.bind();

  return () =>
    disposeAll([
      stopScrollSync,
      unbindReservation,
      anchors.destroy,
      reveals.destroy,
      heroIntro.destroy,
      preloader.destroy,
      mobileNav.destroy,
      header.destroy,
      progress.destroy,
      cursor.destroy,
      reservation.destroy,
      engine.destroy,
    ]);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap({ window, document }), { once: true });
} else {
  bootstrap({ window, document });
}

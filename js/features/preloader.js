import { NOOP_FEATURE } from "../core/dom.js";

/**
 * Sabor Quiteño — preloader
 *
 * Runs a fake progress bar, then dismisses itself on `load` or after a hard
 * timeout. `onDismiss` fires exactly once, so the reveal sequence waiting on it
 * can never be started twice.
 */
export function createPreloader({
  element,
  bar,
  percent,
  line,
  settings,
  motion,
  window: win,
  onDismiss,
}) {
  let settled = false;

  const settle = () => {
    if (settled) return;
    settled = true;
    onDismiss();
  };

  const dismiss = () => {
    if (settled || !element?.isConnected) {
      element?.remove();
      settle();
      return;
    }
    motion.to(line, { scaleY: 0, transformOrigin: "top", duration: 0.6, ease: "power3.in" });
    motion.to(element, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      delay: 0.2,
      onComplete: () => {
        element.remove();
        settle();
      },
    });
  };

  if (!element || motion.reduced || !motion.available) {
    element?.remove();
    settle();
    return NOOP_FEATURE;
  }

  const { tickMs, maxProgressPerTick, minProgressPerTick, maxWaitMs } = settings.preloader;
  let progress = 0;

  const interval = win.setInterval(() => {
    progress = Math.min(100, progress + minProgressPerTick + Math.floor(Math.random() * maxProgressPerTick));
    if (percent) percent.textContent = String(progress).padStart(2, "0");
    if (bar) bar.style.width = `${progress}%`;
    if (progress >= 100) win.clearInterval(interval);
  }, tickMs);

  const onLoad = () => {
    win.clearInterval(interval);
    if (percent) percent.textContent = "100";
    if (bar) bar.style.width = "100%";
    dismiss();
  };

  win.addEventListener("load", onLoad, { once: true });

  const timeout = win.setTimeout(() => {
    if (element.isConnected) dismiss();
  }, maxWaitMs);

  return {
    destroy() {
      win.clearInterval(interval);
      win.clearTimeout(timeout);
      win.removeEventListener("load", onLoad);
      element.remove();
    },
  };
}

import { NOOP_FEATURE, on, qsa } from "../core/dom.js";

const ICON = {
  closed: '<span class="w-7 h-[1.5px] block transition-all"></span><span class="w-7 h-[1.5px] block mt-2 transition-all"></span>',
  open: '<span class="w-7 h-[1.5px] block rotate-45 translate-y-[4px] transition-all"></span><span class="w-7 h-[1.5px] block -rotate-45 -translate-y-[2.5px] transition-all"></span>',
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sabor Quiteño — mobile navigation
 *
 * Owns the panel's open/closed state, focus handling and scroll locking.
 * The panel covers the viewport, so Tab is trapped inside it (plus the toggle
 * button, the legitimate way out) following the WAI-ARIA dialog pattern;
 * otherwise keyboard users land on content hidden behind the overlay.
 * Depends only on the injected scroll engine for closing after navigation.
 */
export function createMobileNavigation({ button, panel, window: win, document: doc, body, desktopBreakpoint }) {
  if (!button || !panel) return NOOP_FEATURE;

  const links = qsa("a", panel);
  let isOpen = false;
  let scrollbarCompensation = 0;

  const lockScroll = () => {
    scrollbarCompensation = win.innerWidth - doc.documentElement.clientWidth;
    if (scrollbarCompensation > 0) body.style.paddingRight = `${scrollbarCompensation}px`;
    body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    body.style.paddingRight = "";
    body.style.overflow = "";
  };

  const setOpen = (next) => {
    if (next === isOpen) return;
    isOpen = next;

    panel.classList.toggle("hidden", !isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
    button.setAttribute("aria-expanded", String(isOpen));
    button.innerHTML = isOpen ? ICON.open : ICON.closed;

    if (isOpen) {
      lockScroll();
      links[0]?.focus();
    } else {
      unlockScroll();
    }
  };

  const trapFocus = (event) => {
    if (event.key !== "Tab" || !isOpen) return;
    const items = [button, ...qsa(FOCUSABLE, panel)];
    const first = items[0];
    const last = items[items.length - 1];
    const active = doc.activeElement;
    if (!event.shiftKey && (active === last || !items.includes(active))) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || !items.includes(active))) {
      event.preventDefault();
      last.focus();
    }
  };

  const disposers = [
    on(button, "click", () => setOpen(!isOpen)),
    on(doc, "keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
        button.focus();
      }
    }),
    on(doc, "keydown", trapFocus),
    on(win, "resize", () => {
      if (win.innerWidth >= desktopBreakpoint && isOpen) setOpen(false);
    }),
    ...links.map((link) => on(link, "click", () => setOpen(false))),
  ];

  return {
    setOpen,
    get isOpen() {
      return isOpen;
    },
    destroy() {
      disposers.forEach((dispose) => dispose());
      unlockScroll();
    },
  };
}
